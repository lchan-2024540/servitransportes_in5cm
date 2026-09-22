import { z } from 'zod';

export const combustibleSchema = z.object({
    vehiculo_id: z.number(),
    fecha: z.string().min(1),
    litros: z.number().optional(),
    costo: z.number().optional(),
    kilometraje: z.number().optional(),
});

export const combustibleUpdateSchema = combustibleSchema.partial();
