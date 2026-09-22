export type Rol = 'admin' | 'conductor';

export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    password_hash: string;
    rol: Rol;
    conductor_id?: number;
    fecha_registro?: string;
}
