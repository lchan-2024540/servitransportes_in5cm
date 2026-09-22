import { z } from 'zod';

export const seguroSchema = z.object({
    vehiculo_id: z.number(),
    aseguradora: z.string().min(1),
    numero_poliza: z.string().min(1),
    fecha_vencimiento: z.string().min(1),
});

export const seguroUpdateSchema = seguroSchema.partial();
