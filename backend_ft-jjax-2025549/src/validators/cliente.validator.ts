import { z } from 'zod';

export const clienteSchema = z.object({
    nombre: z.string().min(1),
    nit: z.string().min(1).optional(),
    telefono: z.string().min(1).optional(),
    correo: z.string().email().optional(),
    direccion: z.string().min(1).optional(),
});

export const clienteUpdateSchema = clienteSchema.partial();
