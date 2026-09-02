import { IncomingMessage, ServerResponse } from 'http';
import { ZodSchema } from 'zod';
import { ServicioCrud } from './service.factory';
import { enviarJson, leerCuerpo } from '../utils/http.util';
import { schemaValidator } from '../utils/middleware/schemaValidator';

export interface RutasCrud {
    listar: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
    obtener: (req: IncomingMessage, res: ServerResponse, id: number) => Promise<void>;
    crear: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
    actualizar: (req: IncomingMessage, res: ServerResponse, id: number) => Promise<void>;
    eliminar: (req: IncomingMessage, res: ServerResponse, id: number) => Promise<void>;
}

// crea los 5 handlers http de una entidad conectando: validators (zod) -> service -> respuesta json
export function crearRutasCrud<T>(
    servicio: ServicioCrud<T>,
    schemaCrear: ZodSchema<any>,
    schemaActualizar: ZodSchema<any>,
): RutasCrud {
    return {
        async listar(_req, res) {
            enviarJson(res, 200, await servicio.listar());
        },
        async obtener(_req, res, id) {
            enviarJson(res, 200, await servicio.obtener(id));
        },
        async crear(req, res) {
            const datos = schemaValidator(schemaCrear, await leerCuerpo(req));
            enviarJson(res, 201, await servicio.crear(datos));
        },
        async actualizar(req, res, id) {
            const datos = schemaValidator(schemaActualizar, await leerCuerpo(req));
            enviarJson(res, 200, await servicio.actualizar(id, datos));
        },
        async eliminar(_req, res, id) {
            enviarJson(res, 200, await servicio.eliminar(id));
        },
    };
}
