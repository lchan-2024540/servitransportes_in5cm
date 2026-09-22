export interface Conductor {
    id: number;
    nombre: string;
    licencia: string;
    telefono?: string;
    correo?: string;
    fecha_contratacion?: string;
    estado?: string;
    vehiculo_id?: number;
}
