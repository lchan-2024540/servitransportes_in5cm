import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { buscarEntidad } from '../../../core/config/entidades.config';
import { ConfigEntidad } from '../../../core/config/entidad.model';
import { EntidadService } from '../../../core/services/entidad.service';
import { AuthService } from '../../../core/services/auth.service';

interface VehiculoOpcion {
    id: number;
    placa: string;
    marca?: string;
    modelo?: string;
}

interface RegistroCombustible {
    vehiculo_id: number;
    litros: number;
    kilometraje: number;
}

// rendimiento (km recorridos por cada litro cargado) estimado por defecto
// para un camion de volteo, cuando un vehiculo aun no tiene suficiente
// historial de combustible para calcularlo con datos reales.
const RENDIMIENTO_ESTIMADO_KM_POR_LITRO = 3;

@Component({
    selector: 'app-entidad-lista',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './entidad-lista.component.html',
    styleUrl: './entidad-lista.component.scss',
})
export class EntidadListaComponent implements OnInit {
    config!: ConfigEntidad;
    registros: any[] = [];
    cargando = true;
    mensajeError = '';

    // id del registro cuyo mapa esta expandido (solo aplica a rutas, por ahora)
    mapaAbiertoId: number | null = null;

    // ---- calculo de distancia real y recomendacion de combustible (solo rutas) ----
    vehiculos: VehiculoOpcion[] = [];
    private combustibles: RegistroCombustible[] = [];

    calculandoDistancia = false;
    errorCalculo = '';
    distanciaCalculada: number | null = null;
    duracionCalculada: number | null = null;

    vehiculoParaCalculo: number | null = null;
    idaYVuelta = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private entidadService: EntidadService,
        private sanitizer: DomSanitizer,
        public authService: AuthService,
    ) {}

    // el conductor solo tiene lectura en algunas entidades (ej. rutas, envios);
    // la plantilla usa esto para ocultar "Nuevo", "Editar" y "Eliminar"
    get puedeEditar(): boolean {
        return this.authService.puedeEditar(this.config);
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            const clave = params.get('entidad')!;
            const config = buscarEntidad(clave);

            if (!config || !this.authService.puedeVer(config)) {
                this.router.navigate(['/']);
                return;
            }

            this.config = config;
            this.cargar();

            if (this.esRutas) {
                if (this.authService.esAdmin()) {
                    this.entidadService.listar<VehiculoOpcion>('vehiculos').subscribe({
                        next: (datos) => (this.vehiculos = datos),
                        error: () => {},
                    });
                } else {
                    // el conductor no tiene permiso sobre "vehiculos": ya sabe cual es
                    // su propio camion porque viene en su sesion (usuario.vehiculo_id)
                    this.vehiculoParaCalculo = this.authService.usuarioActual()?.vehiculo_id ?? null;
                }
                this.entidadService.listar<RegistroCombustible>('combustibles').subscribe({
                    next: (datos) => (this.combustibles = datos),
                    error: () => {},
                });
            }
        });
    }

    cargar(): void {
        this.cargando = true;
        this.mensajeError = '';
        this.entidadService.listar(this.config.clave).subscribe({
            next: (datos) => {
                this.registros = datos;
                this.cargando = false;
            },
            error: (error) => {
                this.mensajeError = error?.error?.error || 'No se pudieron cargar los datos.';
                this.cargando = false;
            },
        });
    }

    // etiqueta legible para el encabezado de columna (o "ID" para la llave primaria)
    etiquetaColumna(clave: string): string {
        if (clave === 'id') return 'ID';
        const campo = this.config.campos.find((c) => c.key === clave);
        return campo?.etiqueta || clave;
    }

    // por ahora el mapa gps, el calculo de distancia y la recomendacion de
    // combustible solo aplican a la entidad "rutas"
    get esRutas(): boolean {
        return this.config?.clave === 'rutas';
    }

    alternarMapa(id: number): void {
        const abriendo = this.mapaAbiertoId !== id;
        this.mapaAbiertoId = abriendo ? id : null;

        // al abrir/cerrar una fila se reinicia el calculo, para no mostrar
        // el resultado de una ruta distinta a la que se acaba de abrir.
        // el conductor no elige camion (siempre es el suyo), asi que no se resetea.
        this.distanciaCalculada = null;
        this.duracionCalculada = null;
        this.errorCalculo = '';
        this.idaYVuelta = false;
        if (this.authService.esAdmin()) {
            this.vehiculoParaCalculo = null;
        }
    }

    // mapa embebido de google (sin api key) centrado en el texto del destino
    obtenerMapaDestino(destino: string): SafeResourceUrl {
        const url = `https://www.google.com/maps?q=${encodeURIComponent(destino || '')}&output=embed`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    // geocodifica origen y destino (Nominatim/OpenStreetMap, gratis) y calcula
    // la distancia real por carretera y el tiempo estimado (OSRM, gratis)
    async calcularDistancia(registro: any): Promise<void> {
        this.calculandoDistancia = true;
        this.errorCalculo = '';
        this.distanciaCalculada = null;
        this.duracionCalculada = null;

        try {
            const [origen, destino] = await Promise.all([
                this.geocodificar(registro.origen),
                this.geocodificar(registro.destino),
            ]);

            if (!origen || !destino) {
                this.errorCalculo = 'No se pudo ubicar el origen o el destino en el mapa.';
                this.calculandoDistancia = false;
                return;
            }

            const url = `https://router.project-osrm.org/route/v1/driving/${origen.lon},${origen.lat};${destino.lon},${destino.lat}?overview=false`;
            const respuesta = await fetch(url);
            if (!respuesta.ok) throw new Error('fallo el calculo de ruta');

            const datos = await respuesta.json();
            const ruta = datos?.routes?.[0];
            if (!ruta) {
                this.errorCalculo = 'No se encontró una ruta por carretera entre esos puntos.';
                this.calculandoDistancia = false;
                return;
            }

            this.distanciaCalculada = Math.round((ruta.distance / 1000) * 10) / 10; // metros -> km
            this.duracionCalculada = Math.round((ruta.duration / 3600) * 10) / 10; // segundos -> horas
        } catch {
            this.errorCalculo = 'No se pudo calcular la distancia en este momento. Intenta de nuevo.';
        } finally {
            this.calculandoDistancia = false;
        }
    }

    private async geocodificar(lugar: string): Promise<{ lat: string; lon: string } | null> {
        const consulta = encodeURIComponent(`${lugar}, Guatemala`);
        const respuesta = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${consulta}`);
        if (!respuesta.ok) return null;
        const resultados = await respuesta.json();
        return resultados?.[0] ?? null;
    }

    // guarda la distancia/tiempo recien calculados directamente en la ruta
    guardarDistanciaCalculada(registro: any): void {
        if (this.distanciaCalculada === null) return;

        this.entidadService.actualizar('rutas', registro.id, {
            distancia_km: this.distanciaCalculada,
            tiempo_estimado_horas: this.duracionCalculada,
        }).subscribe({
            next: () => this.cargar(),
            error: (error) => {
                this.errorCalculo = error?.error?.error || 'No se pudo guardar la distancia calculada.';
            },
        });
    }

    // rendimiento (km por litro) de un vehiculo, calculado a partir de su
    // historial real en "combustible": por cada carga, cuantos km avanzo el
    // odometro desde la carga anterior, dividido entre los litros cargados
    rendimientoVehiculo(vehiculoId: number): { valor: number; esEstimado: boolean } {
        const registros = this.combustibles
            .filter((c) => c.vehiculo_id === vehiculoId && c.kilometraje != null && c.litros > 0)
            .sort((a, b) => a.kilometraje - b.kilometraje);

        const razones: number[] = [];
        for (let i = 1; i < registros.length; i++) {
            const deltaKm = registros[i].kilometraje - registros[i - 1].kilometraje;
            if (deltaKm > 0) {
                razones.push(deltaKm / registros[i].litros);
            }
        }

        if (razones.length === 0) {
            return { valor: RENDIMIENTO_ESTIMADO_KM_POR_LITRO, esEstimado: true };
        }
        const promedio = razones.reduce((suma, r) => suma + r, 0) / razones.length;
        return { valor: Math.round(promedio * 10) / 10, esEstimado: false };
    }

    // litros recomendados para recorrer la ruta con el vehiculo seleccionado
    litrosRecomendados(registro: any): { litros: number; rendimiento: number; esEstimado: boolean } | null {
        if (!this.vehiculoParaCalculo) return null;

        const distanciaKm = this.distanciaCalculada ?? Number(registro.distancia_km) ?? 0;
        if (!distanciaKm) return null;

        const distanciaTotal = this.idaYVuelta ? distanciaKm * 2 : distanciaKm;
        const { valor: rendimiento, esEstimado } = this.rendimientoVehiculo(this.vehiculoParaCalculo);
        const litros = Math.round((distanciaTotal / rendimiento) * 10) / 10;

        return { litros, rendimiento, esEstimado };
    }

    eliminar(id: number): void {
        if (!confirm(`¿Eliminar este ${this.config.tituloSingular.toLowerCase()}? Esta acción no se puede deshacer.`)) {
            return;
        }
        this.entidadService.eliminar(this.config.clave, id).subscribe({
            next: () => this.cargar(),
            error: (error) => {
                this.mensajeError = error?.error?.error || 'No se pudo eliminar el registro.';
            },
        });
    }
}
