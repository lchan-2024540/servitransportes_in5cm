import { z } from 'zod';

export const conductorSchema = z.object({
    nombre: z.string().min(1),
    licencia: z.string().min(1),
    telefono: z.string().min(1).optional(),
    correo: z.string().email().optional(),
    fecha_contratacion: z.string().min(1).optional(),
    estado: z.string().min(1).optional(),
    vehiculo_id: z.number().optional(),
});

export const conductorUpdateSchema = conductorSchema.partial();
