import { IncomingMessage, ServerResponse } from 'http';
import { entidades } from '../types/entidad';
import { enviarJson, leerCuerpo } from '../core/http.util';
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from '../core/crud.service';


export async function manejarPeticion(req: IncomingMessage, res: ServerResponse) {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const segmentos = url.pathname.split('/').filter(Boolean); 

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

    const entidad = entidades.find((e) => e.ruta === nombreRuta);

    if (!entidad) {
        enviarJson(res, 404, { error: `la entidad '${nombreRuta}' no existe` });
        return;
    }

    try {
        switch (req.method) {
            case 'GET':
                if (id !== undefined) {
                    const registro = await obtenerPorId(entidad.tabla, id);
                    if (!registro) {
                        enviarJson(res, 404, { error: 'registro no encontrado' });
                        return;
                    }
                    enviarJson(res, 200, registro);
                } else {
                    const registros = await obtenerTodos(entidad.tabla);
                    enviarJson(res, 200, registros);
                }
                break;

            case 'POST': {
                const datos = await leerCuerpo(req);
                const nuevoRegistro = await crear(entidad.tabla, datos);
                enviarJson(res, 201, nuevoRegistro);
                break;
            }

            case 'PUT': {
                if (id === undefined) {
                    enviarJson(res, 400, { error: 'debes indicar el id a actualizar' });
                    return;
                }
                const datos = await leerCuerpo(req);
                const registroActualizado = await actualizar(entidad.tabla, id, datos);
                if (!registroActualizado) {
                    enviarJson(res, 404, { error: 'registro no encontrado' });
                    return;
                }
                enviarJson(res, 200, registroActualizado);
                break;
            }

            case 'DELETE': {
                if (id === undefined) {
                    enviarJson(res, 400, { error: 'debes indicar el id a eliminar' });
                    return;
                }
                const registroEliminado = await eliminar(entidad.tabla, id);
                if (!registroEliminado) {
                    enviarJson(res, 404, { error: 'registro no encontrado' });
                    return;
                }
                enviarJson(res, 200, { mensaje: 'registro eliminado', registro: registroEliminado });
                break;
            }

            default:
                enviarJson(res, 405, { error: 'metodo no permitido' });
        }
    } catch (error) {
        console.error('error procesando la peticion:', error);
        enviarJson(res, 500, { error: 'error interno del servidor' });
    }

}
