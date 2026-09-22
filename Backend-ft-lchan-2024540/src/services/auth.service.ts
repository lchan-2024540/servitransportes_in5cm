import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import { AuthError } from '../errors/auth.error';
import { Rol } from '../models/usuario';

const JWT_SECRET = process.env.JWT_SECRET || 'cambia_este_secreto_en_produccion';
const JWT_EXPIRA_EN = '8h';

interface DatosRegistro {
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    password: string;
    rol: Rol;
}

interface DatosLogin {
    email: string;
    password: string;
}

function generarToken(id: number, email: string, rol: Rol) {
    return jwt.sign({ id, email, rol }, JWT_SECRET, { expiresIn: JWT_EXPIRA_EN });
}

export function verificarToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as { id: number; email: string; rol: Rol };
    } catch {
        throw new AuthError('token invalido o expirado');
    }
}

// crea el usuario con la contraseña ya hasheada (nunca se guarda en texto plano)
export async function registrarUsuario(datos: DatosRegistro) {
    const existente = await pool.query('select id from usuario where email = $1', [datos.email]);
    if (existente.rows.length > 0) {
        throw new AuthError('ya existe una cuenta registrada con ese correo');
    }

    const passwordHash = await bcrypt.hash(datos.password, 10);

    const resultado = await pool.query(
        `insert into usuario (nombre, apellido, email, telefono, password_hash, rol)
         values ($1, $2, $3, $4, $5, $6)
         returning id, nombre, apellido, email, telefono, rol, fecha_registro`,
        [datos.nombre, datos.apellido, datos.email, datos.telefono ?? null, passwordHash, datos.rol],
    );

    const usuario = resultado.rows[0];
    const token = generarToken(usuario.id, usuario.email, usuario.rol);
    return { usuario, token };
}

// valida credenciales y devuelve un token jwt si son correctas
export async function iniciarSesion(datos: DatosLogin) {
    const resultado = await pool.query('select * from usuario where email = $1', [datos.email]);
    const usuario = resultado.rows[0];

    if (!usuario) {
        throw new AuthError('correo o contraseña incorrectos');
    }

    const passwordOk = await bcrypt.compare(datos.password, usuario.password_hash);
    if (!passwordOk) {
        throw new AuthError('correo o contraseña incorrectos');
    }

    const token = generarToken(usuario.id, usuario.email, usuario.rol);
    const { password_hash, ...usuarioSinPassword } = usuario;
    return { usuario: usuarioSinPassword, token };
}
