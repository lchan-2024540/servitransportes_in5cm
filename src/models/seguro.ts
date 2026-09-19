export interface Seguro {
    id: number;
    vehiculo_id: number;
    aseguradora?: string;
    numero_poliza?: string;
    fecha_inicio?: string;
    fecha_vencimiento?: string;
    costo?: number;
}
