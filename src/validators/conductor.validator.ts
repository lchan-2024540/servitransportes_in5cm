import { z } from 'zod';

export const conductorSchema = z.object({
    nombre: z.string().min(1),
    dpi: z.string().min(1),
    licencia: z.string().min(1),
    tipo_licencia: z.string().min(1),
    estado: z.string().min(1).optional(),
});

export const conductorUpdateSchema = conductorSchema.partial();
