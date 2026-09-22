import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LogoComponent } from '../../../shared/logo/logo.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, LogoComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    cargando = false;
    mensajeError = '';

    formulario = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
    });

    get email() { return this.formulario.controls.email; }
    get password() { return this.formulario.controls.password; }

    enviar(): void {
        this.mensajeError = '';

        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            this.mensajeError = 'Revisa los campos marcados antes de continuar.';
            return;
        }

        this.cargando = true;
        this.authService.login(this.formulario.getRawValue() as { email: string; password: string }).subscribe({
            next: () => {
                this.cargando = false;
                this.router.navigate(['/']);
            },
            error: (error) => {
                this.cargando = false;
                this.mensajeError = error?.error?.error || 'Correo o contraseña incorrectos.';
            },
        });
    }
}
