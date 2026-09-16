import { IncomingMessage, ServerResponse } from 'http';
import { enviarJson, leerCuerpo } from './http.util';
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from './crud.service';

export interface Controlador {
    listar: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
    obtener: (req: IncomingMessage, res: ServerResponse, id: number) => Promise<void>;
    crear: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
    actualizar: (req: IncomingMessage, res: ServerResponse, id: number) => Promise<void>;
    eliminar: (req: IncomingMessage, res: ServerResponse, id: number) => Promise<void>;
}

// valida que los campos requeridos vengan presentes y no vacios en el body
function validarCamposRequeridos(datos: Record<string, unknown>, camposRequeridos: string[]): string[] {
    return camposRequeridos.filter((campo) => {
        const valor = datos[campo];
        return valor === undefined || valor === null || valor === '';
    });
}

// controlador generico para una entidad: contiene las reglas de negocio
// (validacion de campos) antes de delegar la operacion al crud.service
export function crearControlador(tabla: string, camposRequeridos: string[] = []): Controlador {
    return {
        async listar(_req, res) {
            const registros = await obtenerTodos(tabla);
            enviarJson(res, 200, registros);
        },

        async obtener(_req, res, id) {
            if (Number.isNaN(id)) {
                enviarJson(res, 400, { error: 'el id debe ser un numero valido' });
                return;
            }
            const registro = await obtenerPorId(tabla, id);
            if (!registro) {
                enviarJson(res, 404, { error: `registro no encontrado en ${tabla}` });
                return;
            }
            enviarJson(res, 200, registro);
        },

        async crear(req, res) {
            const datos = await leerCuerpo(req);
            const faltantes = validarCamposRequeridos(datos, camposRequeridos);
            if (faltantes.length > 0) {
                enviarJson(res, 400, { error: `faltan campos requeridos: ${faltantes.join(', ')}` });
                return;
            }
            const nuevoRegistro = await crear(tabla, datos);
            enviarJson(res, 201, nuevoRegistro);
        },

        async actualizar(req, res, id) {
            if (Number.isNaN(id)) {
                enviarJson(res, 400, { error: 'el id debe ser un numero valido' });
                return;
            }
            const datos = await leerCuerpo(req);
            if (Object.keys(datos).length === 0) {
                enviarJson(res, 400, { error: 'debes enviar al menos un campo para actualizar' });
                return;
            }
            const registroActualizado = await actualizar(tabla, id, datos);
            if (!registroActualizado) {
                enviarJson(res, 404, { error: `registro no encontrado en ${tabla}` });
                return;
            }
            enviarJson(res, 200, registroActualizado);
        },

        async eliminar(_req, res, id) {
            if (Number.isNaN(id)) {
                enviarJson(res, 400, { error: 'el id debe ser un numero valido' });
                return;
            }
            const registroEliminado = await eliminar(tabla, id);
            if (!registroEliminado) {
                enviarJson(res, 404, { error: `registro no encontrado en ${tabla}` });
                return;
            }
            enviarJson(res, 200, { mensaje: 'registro eliminado', registro: registroEliminado });
        },
    };
}
