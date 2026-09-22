import { z } from 'zod';

export const clienteSchema = z.object({
    nombre_empresa: z.string().min(1),
    nit: z.string().min(1),
    telefono: z.string().min(1).optional(),
    email: z.string().email().optional(),
});

export const clienteUpdateSchema = clienteSchema.partial();
