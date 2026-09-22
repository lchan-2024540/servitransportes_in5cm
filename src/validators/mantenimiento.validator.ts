import { z } from 'zod';

export const mantenimientoSchema = z.object({
    vehiculo_id: z.number(),
    tipo: z.string().min(1),
    fecha: z.string().min(1),
    costo: z.number(),
    kilometraje: z.number(),
});

export const mantenimientoUpdateSchema = mantenimientoSchema.partial();
