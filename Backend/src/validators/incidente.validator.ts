import { z } from 'zod';

export const incidenteSchema = z.object({
    envio_id: z.number(),
    vehiculo_id: z.number(),
    fecha: z.string().min(1).optional(),
    tipo: z.string().min(1).optional(),
    descripcion: z.string().min(1).optional(),
    gravedad: z.string().min(1).optional(),
});

export const incidenteUpdateSchema = incidenteSchema.partial();
