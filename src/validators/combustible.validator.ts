import { z } from 'zod';

export const combustibleSchema = z.object({
    vehiculo_id: z.number(),
    conductor_id: z.number(),
    fecha: z.string().min(1),
    litros: z.number(),
    costo: z.number(),
});

export const combustibleUpdateSchema = combustibleSchema.partial();
