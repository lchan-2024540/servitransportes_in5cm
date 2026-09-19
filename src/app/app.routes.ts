import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { permisoLecturaGuard, permisoEscrituraGuard } from './core/guards/permiso.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    },
    {
        path: '',
        loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
            },
            {
                path: ':entidad/nuevo',
                loadComponent: () => import('./features/entidades/entidad-formulario/entidad-formulario.component').then((m) => m.EntidadFormularioComponent),
                canActivate: [permisoEscrituraGuard],
            },
            {
                path: ':entidad/:id/editar',
                loadComponent: () => import('./features/entidades/entidad-formulario/entidad-formulario.component').then((m) => m.EntidadFormularioComponent),
                canActivate: [permisoEscrituraGuard],
            },
            {
                path: ':entidad',
                loadComponent: () => import('./features/entidades/entidad-lista/entidad-lista.component').then((m) => m.EntidadListaComponent),
                canActivate: [permisoLecturaGuard],
            },
        ],
    },
    { path: '**', redirectTo: '' },
];
