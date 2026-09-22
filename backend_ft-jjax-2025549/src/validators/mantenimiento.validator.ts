import { z } from 'zod';

export const mantenimientoSchema = z.object({
    vehiculo_id: z.number(),
    fecha: z.string().min(1),
    tipo: z.string().min(1).optional(),
    costo: z.number().optional(),
    descripcion: z.string().min(1).optional(),
});

export const mantenimientoUpdateSchema = mantenimientoSchema.partial();
