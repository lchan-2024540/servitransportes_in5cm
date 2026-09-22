export interface Incidente {
    id: number;
    envio_id: number;
    vehiculo_id: number;
    fecha?: string;
    tipo?: string;
    descripcion?: string;
    gravedad?: string;
}
