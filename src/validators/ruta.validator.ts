import { z } from 'zod';

export const rutaSchema = z.object({
    origen: z.string().min(1),
    destino: z.string().min(1),
    distancia_km: z.number().optional(),
    tiempo_estimado_horas: z.number().optional(),
});

export const rutaUpdateSchema = rutaSchema.partial();
