import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export type Rol = 'admin' | 'conductor';

export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    rol: Rol;
    conductor_id?: number;
    vehiculo_id?: number;
    vehiculo_placa?: string;
    vehiculo_marca?: string;
    vehiculo_modelo?: string;
    fecha_registro?: string;
}

export interface DatosRegistro {
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    password: string;
    rol: Rol;
    conductor_id?: number;
}

export interface DatosLogin {
    email: string;
    password: string;
}

interface RespuestaAuth {
    usuario: Usuario;
    token: string;
}

const CLAVE_TOKEN = 'st_token';
const CLAVE_USUARIO = 'st_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
    // signal reactivo con el usuario actual, usado por el shell y los guards
    usuarioActual = signal<Usuario | null>(this.leerUsuarioGuardado());

    constructor(private http: HttpClient) {}

    login(datos: DatosLogin): Observable<RespuestaAuth> {
        return this.http.post<RespuestaAuth>(`${environment.apiUrl}/auth/login`, datos).pipe(
            tap((respuesta) => this.guardarSesion(respuesta)),
        );
    }

    registrar(datos: DatosRegistro): Observable<RespuestaAuth> {
        return this.http.post<RespuestaAuth>(`${environment.apiUrl}/auth/registro`, datos).pipe(
            tap((respuesta) => this.guardarSesion(respuesta)),
        );
    }

    cerrarSesion(): void {
        sessionStorage.removeItem(CLAVE_TOKEN);
        sessionStorage.removeItem(CLAVE_USUARIO);
        this.usuarioActual.set(null);
    }

    obtenerToken(): string | null {
        return sessionStorage.getItem(CLAVE_TOKEN);
    }

    estaAutenticado(): boolean {
        return !!this.obtenerToken();
    }

    esAdmin(): boolean {
        return this.usuarioActual()?.rol === 'admin';
    }

    // ¿el usuario actual puede ver el listado de esta entidad?
    puedeVer(config: { rolesLectura: Rol[] }): boolean {
        const rol = this.usuarioActual()?.rol;
        return !!rol && config.rolesLectura.includes(rol);
    }

    // ¿el usuario actual puede crear/editar/eliminar registros de esta entidad?
    puedeEditar(config: { rolesEscritura: Rol[] }): boolean {
        const rol = this.usuarioActual()?.rol;
        return !!rol && config.rolesEscritura.includes(rol);
    }

    private guardarSesion(respuesta: RespuestaAuth): void {
        sessionStorage.setItem(CLAVE_TOKEN, respuesta.token);
        sessionStorage.setItem(CLAVE_USUARIO, JSON.stringify(respuesta.usuario));
        this.usuarioActual.set(respuesta.usuario);
    }

    private leerUsuarioGuardado(): Usuario | null {
        const crudo = sessionStorage.getItem(CLAVE_USUARIO);
        return crudo ? (JSON.parse(crudo) as Usuario) : null;
    }
}
