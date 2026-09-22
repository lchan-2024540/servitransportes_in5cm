export interface Factura {
    id: number;
    envio_id: number;
    fecha_emision?: string;
    monto: number;
    iva?: number;
    total?: number;
    estado_pago?: string;
}
