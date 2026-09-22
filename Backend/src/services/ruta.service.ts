import { crearServicioCrud } from '../core/service.factory';
import { pool } from '../config/db';
import { NotFoundError } from '../errors/notFound.error';
import { Ruta } from '../models/ruta';

// service de la entidad 'ruta': logica de negocio sobre la tabla 'ruta'
export const rutaService = crearServicioCrud<Ruta>('ruta');

// el conductor solo debe ver las rutas que le asignaron: las que aparecen
// en alguno de sus propios viajes (envio.conductor_id). un admin ve todas
// a traves de rutaService normal; estas dos funciones son solo para el rol conductor.
export async function listarRutasDeConductor(conductorId: number): Promise<Ruta[]> {
    const r = await pool.query(
        `select distinct r.* from ruta r
         join envio e on e.ruta_id = r.id
         where e.conductor_id = $1
         order by r.id`,
        [conductorId],
    );
    return r.rows;
}

export async function obtenerRutaDeConductor(conductorId: number, id: number): Promise<Ruta> {
    const r = await pool.query(
        `select distinct r.* from ruta r
         join envio e on e.ruta_id = r.id
         where e.conductor_id = $1 and r.id = $2
         limit 1`,
        [conductorId, id],
    );
    if (!r.rows[0]) throw new NotFoundError('ruta');
    return r.rows[0];
}
