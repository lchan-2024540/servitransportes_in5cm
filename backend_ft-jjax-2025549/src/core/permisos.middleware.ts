import { ForbiddenError } from '../errors/forbidden.error';

type Metodo = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Rol = 'admin' | 'conductor';

// el admin tiene acceso total (ver y editar) a todas las entidades.
// el conductor solo puede editar (crear/actualizar/eliminar) mantenimientos,
// combustible e incidentes, y ver (solo lectura) rutas y envios.
// cualquier entidad que no aparezca aqui queda fuera del alcance del conductor.
const PERMISOS_CONDUCTOR: Record<string, Metodo[]> = {
    mantenimientos: ['GET', 'POST', 'PUT', 'DELETE'],
    combustibles: ['GET', 'POST', 'PUT', 'DELETE'],
    incidentes: ['GET', 'POST', 'PUT', 'DELETE'],
    rutas: ['GET'],
    envios: ['GET'],
};

// valida que el rol del usuario autenticado pueda ejecutar este metodo sobre esta entidad.
// lanza ForbiddenError (403) si no tiene permiso; el admin siempre pasa.
export function verificarPermisoEntidad(rol: Rol, entidadClave: string, metodo: string) {
    if (rol === 'admin') {
        return;
    }

    const metodosPermitidos = PERMISOS_CONDUCTOR[entidadClave];
    if (!metodosPermitidos || !metodosPermitidos.includes(metodo as Metodo)) {
        throw new ForbiddenError('tu rol de conductor no tiene permiso para realizar esta accion');
    }
}
