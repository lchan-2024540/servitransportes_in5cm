import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { buscarEntidad } from '../../../core/config/entidades.config';
import { ConfigEntidad } from '../../../core/config/entidad.model';
import { EntidadService } from '../../../core/services/entidad.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-entidad-lista',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './entidad-lista.component.html',
    styleUrl: './entidad-lista.component.scss',
})
export class EntidadListaComponent implements OnInit {
    config!: ConfigEntidad;
    registros: any[] = [];
    cargando = true;
    mensajeError = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private entidadService: EntidadService,
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
