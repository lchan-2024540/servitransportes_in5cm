import { z } from 'zod';

// un item = un material o servicio dentro de la orden de compra
export const itemOrdenCompraSchema = z.object({
    descripcion_servicio: z.string().min(1),
    cantidad: z.number().positive(),
    precio_unitario: z.number().positive(),
    subtotal: z.number(),
});

export const ordenCompraSchema = z.object({
    cliente_id: z.number(),
    nit: z.string().min(1),
    fecha: z.string().min(1).optional(),
    items: z.array(itemOrdenCompraSchema).min(1, 'agrega al menos un item'),
    total: z.number(),
});

export const ordenCompraUpdateSchema = ordenCompraSchema.partial();
