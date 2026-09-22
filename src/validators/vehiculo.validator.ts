import { z } from 'zod';

export const vehiculoSchema = z.object({
    placa: z.string().min(1),
    marca: z.string().min(1),
    tipo: z.string().min(1),
    capacidad_carga_kg: z.number(),
    estado: z.string().min(1).optional(),
});

export const vehiculoUpdateSchema = vehiculoSchema.partial();
