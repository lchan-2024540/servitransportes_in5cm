export type Rol = 'admin' | 'conductor';

export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    password_hash: string;
    rol: Rol;
    fecha_registro?: string;
}
