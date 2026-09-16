import { IncomingMessage, ServerResponse } from 'http';
import { controladores } from '../controllers';
import { enviarJson } from '../core/http.util';

// las rutas siguen el patron: /api/<entidad>  y  /api/<entidad>/<id>
// el router solo se encarga de interpretar la url y el metodo http;
// toda la logica de negocio vive en el controlador de cada entidad
export async function manejarPeticion(req: IncomingMessage, res: ServerResponse) {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const segmentos = url.pathname.split('/').filter(Boolean); // ej: ['api', 'clientes', '3']

    if (req.method === 'OPTIONS') {
        enviarJson(res, 204, {});
        return;
    }

    if (segmentos[0] !== 'api' || segmentos.length < 2) {
        enviarJson(res, 404, { error: 'ruta no encontrada' });
        return;
    }

    const nombreRuta = segmentos[1];
    const id = segmentos[2] ? Number(segmentos[2]) : undefined;

    const controlador = controladores[nombreRuta];

    if (!controlador) {
        enviarJson(res, 404, { error: `la entidad '${nombreRuta}' no existe` });
        return;
    }

    try {
        switch (req.method) {
            case 'GET':
                if (id !== undefined) {
                    await controlador.obtener(req, res, id);
                } else {
                    await controlador.listar(req, res);
                }
                break;

            case 'POST':
                await controlador.crear(req, res);
                break;

            case 'PUT':
                if (id === undefined) {
                    enviarJson(res, 400, { error: 'debes indicar el id a actualizar' });
                    return;
                }
                await controlador.actualizar(req, res, id);
                break;

            case 'DELETE':
                if (id === undefined) {
                    enviarJson(res, 400, { error: 'debes indicar el id a eliminar' });
                    return;
                }
                await controlador.eliminar(req, res, id);
                break;

            default:
                enviarJson(res, 405, { error: 'metodo no permitido' });
        }
    } catch (error) {
        console.error('error procesando la peticion:', error);
        enviarJson(res, 500, { error: 'error interno del servidor' });
    }
}
