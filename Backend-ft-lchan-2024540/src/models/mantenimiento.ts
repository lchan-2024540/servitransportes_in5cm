export interface Mantenimiento {
    id: number;
    vehiculo_id: number;
    fecha: string;
    tipo?: string;
    costo?: number;
    descripcion?: string;
}
