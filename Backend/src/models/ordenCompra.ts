export interface ItemOrdenCompra {
    descripcion_servicio: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
}

export interface OrdenCompra {
    id: number;
    cliente_id: number;
    nit: string;
    fecha?: string;
    items: ItemOrdenCompra[];
    total: number;
}
