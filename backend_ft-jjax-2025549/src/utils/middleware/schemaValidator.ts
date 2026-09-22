import { ZodSchema } from 'zod';
import { validarConEsquema } from '../zodHelpers';

// middleware de validacion: envuelve el body de la peticion contra un
// schema de zod antes de que la logica de negocio (service) lo reciba
export function schemaValidator<T>(schema: ZodSchema<T>, datos: unknown): T {
    return validarConEsquema(schema, datos);
}
