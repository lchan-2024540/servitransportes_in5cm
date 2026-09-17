import { z } from 'zod';

export const facturaSchema = z.object({
    envio_id: z.number(),
    cliente_id: z.number(),
    subtotal: z.number(),
    iva: z.number(),
    total: z.number(),
    estado_pago: z.string().min(1).optional(),
});

export const facturaUpdateSchema = facturaSchema.partial();
