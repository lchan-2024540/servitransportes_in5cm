import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { buscarEntidad } from '../../../core/config/entidades.config';
import { ConfigEntidad } from '../../../core/config/entidad.model';
import { EntidadService } from '../../../core/services/entidad.service';

@Component({
    selector: 'app-entidad-formulario',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './entidad-formulario.component.html',
    styleUrl: './entidad-formulario.component.scss',
})
export class EntidadFormularioComponent implements OnInit {
    config!: ConfigEntidad;
    formulario = new FormGroup({});
    idEditando: number | null = null;
    cargando = false;
    guardando = false;
    mensajeError = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private entidadService: EntidadService,
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            const clave = params.get('entidad')!;
            const config = buscarEntidad(clave);

            if (!config) {
                this.router.navigate(['/']);
                return;
            }

            this.config = config;
            this.construirFormulario();

            const idParam = params.get('id');
            this.idEditando = idParam ? Number(idParam) : null;

            if (this.idEditando) {
                this.cargarRegistro(this.idEditando);
            }
        });
    }

    get esEdicion(): boolean {
        return this.idEditando !== null;
    }

    campoInvalido(key: string): boolean {
        const control = this.formulario.get(key);
        return !!control && control.invalid && control.touched;
    }

    private construirFormulario(): void {
        const controles: Record<string, FormControl> = {};
        for (const campo of this.config.campos) {
            const validadores = campo.requerido ? [Validators.required] : [];
            controles[campo.key] = new FormControl(
                campo.tipo === 'number' ? null : '',
                validadores,
            );
        }
        this.formulario = new FormGroup(controles);
    }

    private cargarRegistro(id: number): void {
        this.cargando = true;
        this.entidadService.obtener(this.config.clave, id).subscribe({
            next: (registro: any) => {
                const valores: Record<string, any> = {};
                for (const campo of this.config.campos) {
                    let valor = registro[campo.key];
                    if (campo.tipo === 'date' && valor) {
                        valor = String(valor).substring(0, 10);
                    }
                    valores[campo.key] = valor ?? (campo.tipo === 'number' ? null : '');
                }
                this.formulario.patchValue(valores);
                this.cargando = false;
            },
            error: (error) => {
                this.mensajeError = error?.error?.error || 'No se pudo cargar el registro.';
                this.cargando = false;
            },
        });
    }

    guardar(): void {
        this.mensajeError = '';

        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            this.mensajeError = 'Revisa los campos marcados antes de continuar.';
            return;
        }

        const datos = this.limpiarValoresVacios(this.formulario.getRawValue());
        this.guardando = true;

        const peticion = this.esEdicion
            ? this.entidadService.actualizar(this.config.clave, this.idEditando!, datos)
            : this.entidadService.crear(this.config.clave, datos);

        peticion.subscribe({
            next: () => {
                this.guardando = false;
                this.router.navigate(['/', this.config.clave]);
            },
            error: (error) => {
                this.guardando = false;
                this.mensajeError = error?.error?.error || 'No se pudo guardar el registro.';
            },
        });
    }

    // no manda campos opcionales vacios, para no chocar con validaciones del backend
    private limpiarValoresVacios(valores: Record<string, any>): Record<string, any> {
        const resultado: Record<string, any> = {};
        for (const [clave, valor] of Object.entries(valores)) {
            if (valor !== '' && valor !== null && valor !== undefined) {
                resultado[clave] = valor;
            }
        }
        return resultado;
    }
}
