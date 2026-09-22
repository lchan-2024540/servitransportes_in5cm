import { pool } from '../config/db';

// acceso a datos generico, reutilizado por el service de cada entidad
export async function obtenerTodos(tabla: string) {
    const r = await pool.query(`select * from ${tabla} order by id`);
    return r.rows;
}
export async function obtenerPorId(tabla: string, id: number) {
    const r = await pool.query(`select * from ${tabla} where id = $1`, [id]);
    return r.rows[0];
}
export async function crear(tabla: string, datos: Record<string, unknown>) {
    const columnas = Object.keys(datos);
    const valores = Object.values(datos);
    const marcadores = columnas.map((_, i) => `$${i + 1}`).join(', ');
    const r = await pool.query(
        `insert into ${tabla} (${columnas.join(', ')}) values (${marcadores}) returning *`,
        valores,
    );
    return r.rows[0];
}
export async function actualizar(tabla: string, id: number, datos: Record<string, unknown>) {
    const columnas = Object.keys(datos);
    const valores = Object.values(datos);
    const asignaciones = columnas.map((c, i) => `${c} = $${i + 1}`).join(', ');
    const r = await pool.query(
        `update ${tabla} set ${asignaciones} where id = $${columnas.length + 1} returning *`,
        [...valores, id],
    );
    return r.rows[0];
}
export async function eliminar(tabla: string, id: number) {
    const r = await pool.query(`delete from ${tabla} where id = $1 returning *`, [id]);
    return r.rows[0];
}
