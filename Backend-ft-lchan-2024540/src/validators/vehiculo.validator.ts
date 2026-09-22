import { z } from 'zod';

export const vehiculoSchema = z.object({
    placa: z.string().min(1),
    marca: z.string().min(1).optional(),
    modelo: z.string().min(1).optional(),
    anio: z.number().optional(),
    capacidad_carga: z.number().optional(),
    estado: z.string().min(1).optional(),
});

export const vehiculoUpdateSchema = vehiculoSchema.partial();
