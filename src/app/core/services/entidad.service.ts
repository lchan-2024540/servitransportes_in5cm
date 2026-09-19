import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// servicio crud generico: sirve para las 10 entidades usando su "clave"
// (el segmento de ruta, ej. 'clientes', 'envios') como parametro.
@Injectable({ providedIn: 'root' })
export class EntidadService {
    constructor(private http: HttpClient) {}

    listar<T = any>(clave: string): Observable<T[]> {
        return this.http.get<T[]>(`${environment.apiUrl}/${clave}`);
    }

    obtener<T = any>(clave: string, id: number): Observable<T> {
        return this.http.get<T>(`${environment.apiUrl}/${clave}/${id}`);
    }

    crear<T = any>(clave: string, datos: Partial<T>): Observable<T> {
        return this.http.post<T>(`${environment.apiUrl}/${clave}`, datos);
    }

    actualizar<T = any>(clave: string, id: number, datos: Partial<T>): Observable<T> {
        return this.http.put<T>(`${environment.apiUrl}/${clave}/${id}`, datos);
    }

    eliminar(clave: string, id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/${clave}/${id}`);
    }
}
