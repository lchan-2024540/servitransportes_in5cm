import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// agrega el jwt a toda peticion hacia la api y, si el backend responde 401
// (token vencido o ausente), cierra la sesion y manda al usuario al login.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const token = authService.obtenerToken();

    const peticion = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(peticion).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                authService.cerrarSesion();
                router.navigate(['/login']);
            }
            return throwError(() => error);
        }),
    );
};
