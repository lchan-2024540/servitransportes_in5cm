import * as repo from '../core/crud.repository';
import { NotFoundError } from '../errors/notFound.error';
import { OrdenCompra } from '../models/ordenCompra';
import { ServicioCrud } from '../core/service.factory';

const TABLA = 'orden_compra';

// 'items' es una columna jsonb; el repositorio generico arma el insert/update
// pasando los valores tal cual, y un arreglo js crudo se enviaria como arreglo
// nativo de postgres (no como json). por eso este service, a diferencia de los
// demas, no usa crearServicioCrud directo: convierte 'items' a texto json antes
// de delegar en el repositorio generico. postgres convierte ese texto a jsonb solo.
function prepararDatos(datos: Record<string, unknown>): Record<string, unknown> {
    if (datos['items'] !== undefined) {
        return { ...datos, items: JSON.stringify(datos['items']) };
    }
    return datos;
}

export const ordenCompraService: ServicioCrud<OrdenCompra> = {
    async listar() {
        return repo.obtenerTodos(TABLA) as Promise<OrdenCompra[]>;
    },
    async obtener(id) {
        const registro = await repo.obtenerPorId(TABLA, id);
        if (!registro) throw new NotFoundError(TABLA);
        return registro as OrdenCompra;
    },
    async crear(datos) {
        return repo.crear(TABLA, prepararDatos(datos)) as Promise<OrdenCompra>;
    },
    async actualizar(id, datos) {
        const actualizado = await repo.actualizar(TABLA, id, prepararDatos(datos));
        if (!actualizado) throw new NotFoundError(TABLA);
        return actualizado as OrdenCompra;
    },
    async eliminar(id) {
        const eliminado = await repo.eliminar(TABLA, id);
        if (!eliminado) throw new NotFoundError(TABLA);
        return eliminado as OrdenCompra;
    },
};
