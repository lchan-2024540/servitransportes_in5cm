import { z } from 'zod';

export const incidenteSchema = z.object({
    envio_id: z.number(),
    tipo: z.string().min(1),
    descripcion: z.string().min(1).optional(),
    fecha: z.string().min(1),
});

export const incidenteUpdateSchema = incidenteSchema.partial();
