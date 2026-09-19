import { z } from 'zod';

export const seguroSchema = z.object({
    vehiculo_id: z.number(),
    aseguradora: z.string().min(1).optional(),
    numero_poliza: z.string().min(1).optional(),
    fecha_inicio: z.string().min(1).optional(),
    fecha_vencimiento: z.string().min(1).optional(),
    costo: z.number().optional(),
});

export const seguroUpdateSchema = seguroSchema.partial();
