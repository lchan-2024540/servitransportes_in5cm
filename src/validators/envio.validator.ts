import { z } from 'zod';

export const envioSchema = z.object({
    cliente_id: z.number(),
    conductor_id: z.number(),
    vehiculo_id: z.number(),
    ruta_id: z.number(),
    fecha_salida: z.string().min(1),
    fecha_llegada_est: z.string().min(1),
    estado: z.string().min(1).optional(),
    peso_carga_kg: z.number(),
});

export const envioUpdateSchema = envioSchema.partial();
