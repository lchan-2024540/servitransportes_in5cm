import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { buscarEntidad } from '../config/entidades.config';
import { AuthService } from '../services/auth.service';

// permite entrar al listado de la entidad solo si el rol del usuario tiene lectura sobre ella
export const permisoLecturaGuard: CanActivateFn = (route) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const clave = route.paramMap.get('entidad') ?? (route.data['entidadClave'] as string | undefined);
    const config = clave ? buscarEntidad(clave) : undefined;

    if (!config || !authService.puedeVer(config)) {
        router.navigate(['/']);
        return false;
    }
    return true;
};

// permite entrar a los formularios de crear/editar solo si el rol del usuario tiene escritura sobre ella
export const permisoEscrituraGuard: CanActivateFn = (route) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const clave = route.paramMap.get('entidad') ?? (route.data['entidadClave'] as string | undefined);
    const config = clave ? buscarEntidad(clave) : undefined;

    if (!config || !authService.puedeEditar(config)) {
        router.navigate(['/']);
        return false;
    }
    return true;
};
