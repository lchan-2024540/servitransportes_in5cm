import { ServerResponse } from 'http';
import { enviarJson } from '../utils/http.util';
import { ValidationError } from './validation.error';
import { NotFoundError } from './notFound.error';
import { DatabaseError } from './database.error';

// traduce cualquier error capturado en la ruta a una respuesta http consistente
export function errorHandler(error: unknown, res: ServerResponse) {
    if (error instanceof ValidationError) {
        enviarJson(res, error.statusCode, { error: error.message, detalles: error.detalles });
        return;
    }
    if (error instanceof NotFoundError || error instanceof DatabaseError) {
        enviarJson(res, error.statusCode, { error: error.message });
        return;
    }
    console.error('error no controlado:', error);
    enviarJson(res, 500, { error: 'error interno del servidor' });
}
