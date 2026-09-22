import { IncomingMessage, ServerResponse } from 'http';
import { RutasCrud } from '../core/route.factory';
import { enviarJson } from '../utils/http.util';
import { notFoundMiddleware } from '../utils/middleware/notFound.middleware';
import { errorHandler } from '../errors/errorHandler';
import { requiereAutenticacion } from '../core/auth.middleware';
import { verificarPermisoEntidad } from '../core/permisos.middleware';
import { registrar, login } from './auth.route';
import { clienteRoutes } from './cliente.route';
import { conductorRoutes } from './conductor.route';
import { vehiculoRoutes } from './vehiculo.route';
import { rutaRoutes } from './ruta.route';
import { envioRoutes } from './envio.route';
import { mantenimientoRoutes } from './mantenimiento.route';
import { combustibleRoutes } from './combustible.route';
import { facturaRoutes } from './factura.route';
import { seguroRoutes } from './seguro.route';
import { incidenteRoutes } from './incidente.route';
import { ordenCompraRoutes } from './ordenCompra.route';
import { listarRutasDeConductor, obtenerRutaDeConductor } from '../services/ruta.service';

// mapa: segmento de url (/api/<segmento>) -> handlers crud de esa entidad
const rutas: Record<string, RutasCrud> = {
    clientes: clienteRoutes,
    conductores: conductorRoutes,
    vehiculos: vehiculoRoutes,
    rutas: rutaRoutes,
    envios: envioRoutes,
    mantenimientos: mantenimientoRoutes,
    combustibles: combustibleRoutes,
    facturas: facturaRoutes,
    seguros: seguroRoutes,
    incidentes: incidenteRoutes,
    'ordenes-compra': ordenCompraRoutes,
};

// unico punto de entrada http: resuelve la entidad por url y delega el metodo
export async function apiRouter(req: IncomingMessage, res: ServerResponse) {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const segmentos = url.pathname.split('/').filter(Boolean); // ej: ['api', 'clientes', '3']

    if (req.method === 'OPTIONS') {
        // respuesta al preflight de cors: sin cuerpo, solo los encabezados de enviarJson
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        });
        res.end();
        return;
    }
    if (segmentos[0] !== 'api' || segmentos.length < 2) {
        notFoundMiddleware(res, url.pathname);
        return;
    }

    // rutas de autenticacion: publicas, no requieren token
    if (segmentos[1] === 'auth') {
        try {
            if (req.method === 'POST' && segmentos[2] === 'registro') {
                await registrar(req, res);
                return;
            }
            if (req.method === 'POST' && segmentos[2] === 'login') {
                await login(req, res);
                return;
            }
            notFoundMiddleware(res, url.pathname);
        } catch (error) {
            errorHandler(error, res);
        }
        return;
    }

    const entidad = rutas[segmentos[1]];
    const id = segmentos[2] ? Number(segmentos[2]) : undefined;

    if (!entidad) {
        notFoundMiddleware(res, segmentos[1]);
        return;
    }
    if (id !== undefined && Number.isNaN(id)) {
        enviarJson(res, 400, { error: 'el id debe ser un numero valido' });
        return;
    }

    try {
        // todo el crud de entidades requiere un token jwt valido (Authorization: Bearer <token>)
        const usuarioToken = requiereAutenticacion(req);

        // el admin ve y edita todo; el conductor solo tiene acceso segun su rol
        // (mantenimientos, combustible e incidentes editables; rutas y envios solo lectura)
        verificarPermisoEntidad(usuarioToken.rol, segmentos[1], req.method || 'GET');

        // caso especial: un conductor solo puede ver las rutas que le fueron
        // asignadas (las de sus propios viajes), no el listado completo
        if (segmentos[1] === 'rutas' && usuarioToken.rol === 'conductor' && req.method === 'GET') {
            if (id !== undefined) {
                enviarJson(res, 200, await obtenerRutaDeConductor(usuarioToken.conductor_id!, id));
            } else {
                enviarJson(res, 200, await listarRutasDeConductor(usuarioToken.conductor_id!));
            }
            return;
        }

        switch (req.method) {
            case 'GET':
                id !== undefined ? await entidad.obtener(req, res, id) : await entidad.listar(req, res);
                break;
            case 'POST':
                await entidad.crear(req, res);
                break;
            case 'PUT':
                if (id === undefined) { enviarJson(res, 400, { error: 'debes indicar el id a actualizar' }); break; }
                await entidad.actualizar(req, res, id);
                break;
            case 'DELETE':
                if (id === undefined) { enviarJson(res, 400, { error: 'debes indicar el id a eliminar' }); break; }
                await entidad.eliminar(req, res, id);
                break;
            default:
                enviarJson(res, 405, { error: 'metodo no permitido' });
        }
    } catch (error) {
        errorHandler(error, res);
    }
}
