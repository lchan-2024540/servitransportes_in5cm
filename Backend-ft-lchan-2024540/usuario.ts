export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    password_hash: string;
    fecha_registro?: string;
}
