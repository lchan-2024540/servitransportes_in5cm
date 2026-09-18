import { z } from 'zod';

export const registroSchema = z.object({
    nombre: z.string().min(1),
    apellido: z.string().min(1),
    email: z.string().email(),
    telefono: z.string().min(1).optional(),
    password: z.string().min(8, 'la contraseña debe tener al menos 8 caracteres'),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
