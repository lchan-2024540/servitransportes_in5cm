import { IncomingMessage } from 'http';
import { AuthError } from '../errors/auth.error';
import { verificarToken } from '../services/auth.service';

// extrae y valida el token bearer de la peticion; lanza AuthError si falta o es invalido
export function requiereAutenticacion(req: IncomingMessage) {
    const encabezado = req.headers['authorization'];
    if (!encabezado || Array.isArray(encabezado) || !encabezado.startsWith('Bearer ')) {
        throw new AuthError('debes iniciar sesion para acceder a este recurso');
    }
    const token = encabezado.slice('Bearer '.length).trim();
    return verificarToken(token);
}
