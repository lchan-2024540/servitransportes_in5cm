import { z } from 'zod';

export const registroSchema = z
    .object({
        nombre: z.string().min(1),
        apellido: z.string().min(1),
        email: z.string().email(),
        telefono: z.string().min(1).optional(),
        password: z.string().min(8, 'la contraseña debe tener al menos 8 caracteres'),
        rol: z.enum(['admin', 'conductor']),
        conductor_id: z.number().optional(),
    })
    .refine((datos) => datos.rol !== 'conductor' || datos.conductor_id !== undefined, {
        message: 'debes indicar el id del conductor al que pertenece esta cuenta',
        path: ['conductor_id'],
    });

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
