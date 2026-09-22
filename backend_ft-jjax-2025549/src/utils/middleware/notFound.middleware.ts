import { ServerResponse } from 'http';
import { enviarJson } from '../http.util';

// se ejecuta cuando la url no coincide con ninguna entidad registrada
export function notFoundMiddleware(res: ServerResponse, recurso: string) {
    enviarJson(res, 404, { error: `la ruta '${recurso}' no existe` });
}
