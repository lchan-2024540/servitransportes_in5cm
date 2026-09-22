import { z } from 'zod';

export const envioSchema = z.object({
    cliente_id: z.number(),
    conductor_id: z.number(),
    vehiculo_id: z.number(),
    ruta_id: z.number(),
    fecha_envio: z.string().min(1),
    fecha_entrega: z.string().min(1).optional(),
    estado: z.string().min(1).optional(),
    peso_carga: z.number().optional(),
});

export const envioUpdateSchema = envioSchema.partial();
