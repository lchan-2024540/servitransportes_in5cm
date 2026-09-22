import { ZodSchema } from 'zod';
import { ValidationError } from '../errors/validation.error';

// valida datos contra un schema de zod y lanza ValidationError con mensajes
// legibles si algo no cumple (usado por el middleware schemaValidator)
export function validarConEsquema<T>(schema: ZodSchema<T>, datos: unknown): T {
    const resultado = schema.safeParse(datos);
    if (!resultado.success) {
        const detalles = resultado.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
        throw new ValidationError(detalles);
    }
    return resultado.data;
}
