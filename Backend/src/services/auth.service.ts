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
    conductor_id?: number;
}

interface DatosLogin {
    email: string;
    password: string;
}

interface PayloadToken {
    id: number;
    email: string;
    rol: Rol;
    conductor_id?: number;
    vehiculo_id?: number;
}

function generarToken(payload: PayloadToken) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRA_EN });
}

export function verificarToken(token: string): PayloadToken {
    try {
        return jwt.verify(token, JWT_SECRET) as PayloadToken;
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

    if (datos.rol === 'conductor' && datos.conductor_id) {
        const conductorExiste = await pool.query('select id, vehiculo_id from conductor where id = $1', [datos.conductor_id]);
        if (conductorExiste.rows.length === 0) {
            throw new AuthError('el conductor indicado no existe');
        }
    }

    const passwordHash = await bcrypt.hash(datos.password, 10);

    const resultado = await pool.query(
        `insert into usuario (nombre, apellido, email, telefono, password_hash, rol, conductor_id)
         values ($1, $2, $3, $4, $5, $6, $7)
         returning id, nombre, apellido, email, telefono, rol, conductor_id, fecha_registro`,
        [datos.nombre, datos.apellido, datos.email, datos.telefono ?? null, passwordHash, datos.rol, datos.conductor_id ?? null],
    );

    const usuario = resultado.rows[0];
    const vehiculo = await obtenerVehiculoDeConductor(usuario.conductor_id);
    const token = generarToken({ id: usuario.id, email: usuario.email, rol: usuario.rol, conductor_id: usuario.conductor_id, vehiculo_id: vehiculo?.id });

    return {
        usuario: {
            ...usuario,
            vehiculo_id: vehiculo?.id,
            vehiculo_placa: vehiculo?.placa,
            vehiculo_marca: vehiculo?.marca,
            vehiculo_modelo: vehiculo?.modelo,
        },
        token,
    };
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

    const vehiculo = await obtenerVehiculoDeConductor(usuario.conductor_id);
    const token = generarToken({ id: usuario.id, email: usuario.email, rol: usuario.rol, conductor_id: usuario.conductor_id, vehiculo_id: vehiculo?.id });

    const { password_hash, ...usuarioSinPassword } = usuario;
    return {
        usuario: {
            ...usuarioSinPassword,
            vehiculo_id: vehiculo?.id,
            vehiculo_placa: vehiculo?.placa,
            vehiculo_marca: vehiculo?.marca,
            vehiculo_modelo: vehiculo?.modelo,
        },
        token,
    };
}

// el camion asignado a un conductor (si tiene uno) se resuelve una vez aqui,
// para que el frontend del rol conductor no necesite permiso sobre "vehiculos"
// ni "conductores" solo para saber cual es su propio camion
async function obtenerVehiculoDeConductor(conductorId?: number): Promise<{ id: number; placa: string; marca?: string; modelo?: string } | undefined> {
    if (!conductorId) return undefined;
    const r = await pool.query(
        `select v.id, v.placa, v.marca, v.modelo
         from conductor c
         join vehiculo v on v.id = c.vehiculo_id
         where c.id = $1`,
        [conductorId],
    );
    return r.rows[0] ?? undefined;
}
