export interface Factura {
    id: number;
    envio_id: number;
    cliente_id: number;
    subtotal: number;
    iva: number;
    total: number;
    estado_pago?: string;
}
