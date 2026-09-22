import { pool } from '../config/db';

export async function obtenerTodos(tabla: string) {
    const resultado = await pool.query(`select * from ${tabla} order by id`);
    return resultado.rows;
}

export async function obtenerPorId(tabla: string, id: number) {
    const resultado = await pool.query(`select * from ${tabla} where id = $1`, [id]);
    return resultado.rows[0];
}

export async function crear(tabla: string, datos: Record<string, unknown>) {
    const columnas = Object.keys(datos);
    const valores = Object.values(datos);

    if (columnas.length === 0) {
        throw new Error('no se enviaron datos para crear el registro');
    }

    const marcadores = columnas.map((_, i) => `$${i + 1}`).join(', ');
    const consulta = `insert into ${tabla} (${columnas.join(', ')}) values (${marcadores}) returning *`;

    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

export async function actualizar(tabla: string, id: number, datos: Record<string, unknown>) {
    const columnas = Object.keys(datos);
    const valores = Object.values(datos);

    if (columnas.length === 0) {
        throw new Error('no se enviaron datos para actualizar el registro');
    }

    const asignaciones = columnas.map((col, i) => `${col} = $${i + 1}`).join(', ');
    const consulta = `update ${tabla} set ${asignaciones} where id = $${columnas.length + 1} returning *`;

    const resultado = await pool.query(consulta, [...valores, id]);
    return resultado.rows[0];
}

export async function eliminar(tabla: string, id: number) {
    const resultado = await pool.query(`delete from ${tabla} where id = $1 returning *`, [id]);
    return resultado.rows[0];
}
