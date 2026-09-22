export interface Envio {
    id: number;
    cliente_id: number;
    conductor_id: number;
    vehiculo_id: number;
    ruta_id: number;
    fecha_envio: string;
    fecha_entrega?: string;
    estado?: string;
    peso_carga?: number;
}
