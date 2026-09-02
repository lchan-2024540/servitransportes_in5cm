export interface Envio {
    id: number;
    cliente_id: number;
    conductor_id: number;
    vehiculo_id: number;
    ruta_id: number;
    fecha_salida: string;
    fecha_llegada_est: string;
    estado?: string;
    peso_carga_kg: number;
}
