import { IncomingMessage, ServerResponse } from 'http';
import { enviarJson, leerCuerpo } from '../utils/http.util';
import { schemaValidator } from '../utils/middleware/schemaValidator';
import { registroSchema, loginSchema } from '../validators/usuario.validator';
import { registrarUsuario, iniciarSesion } from '../services/auth.service';

export async function registrar(req: IncomingMessage, res: ServerResponse) {
    const datos = schemaValidator(registroSchema, await leerCuerpo(req));
    const resultado = await registrarUsuario(datos);
    enviarJson(res, 201, resultado);
}

export async function login(req: IncomingMessage, res: ServerResponse) {
    const datos = schemaValidator(loginSchema, await leerCuerpo(req));
    const resultado = await iniciarSesion(datos);
    enviarJson(res, 200, resultado);
}
