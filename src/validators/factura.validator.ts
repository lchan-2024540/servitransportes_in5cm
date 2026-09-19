import { z } from 'zod';

export const facturaSchema = z.object({
    envio_id: z.number(),
    fecha_emision: z.string().min(1).optional(),
    monto: z.number(),
    iva: z.number().optional(),
    total: z.number().optional(),
    estado_pago: z.string().min(1).optional(),
});

export const facturaUpdateSchema = facturaSchema.partial();
