import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// valida que password y confirmacion coincidan
function contraseñasCoinciden(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const password2 = control.get('password2')?.value;
    return password && password2 && password !== password2 ? { noCoincide: true } : null;
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    cargando = false;
    mensajeError = '';

    formulario = this.fb.group({
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telefono: [''],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password2: ['', Validators.required],
        rol: ['conductor', Validators.required],
        terms: [false, Validators.requiredTrue],
    }, { validators: contraseñasCoinciden });

    get nombre() { return this.formulario.controls.nombre; }
    get apellido() { return this.formulario.controls.apellido; }
    get email() { return this.formulario.controls.email; }
    get telefono() { return this.formulario.controls.telefono; }
    get password() { return this.formulario.controls.password; }
    get password2() { return this.formulario.controls.password2; }
    get rol() { return this.formulario.controls.rol; }
    get terms() { return this.formulario.controls.terms; }

    enviar(): void {
        this.mensajeError = '';

        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            this.mensajeError = 'Revisa los campos marcados antes de continuar.';
            return;
        }

        this.cargando = true;
        const { password2, terms, ...datos } = this.formulario.getRawValue();

        this.authService.registrar(datos as any).subscribe({
            next: () => {
                this.cargando = false;
                this.router.navigate(['/']);
            },
            error: (error) => {
                this.cargando = false;
                this.mensajeError = error?.error?.error || 'No se pudo crear la cuenta.';
            },
        });
    }
}
