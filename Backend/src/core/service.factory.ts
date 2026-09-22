import * as repo from './crud.repository';
import { NotFoundError } from '../errors/notFound.error';

export interface ServicioCrud<T> {
    listar(): Promise<T[]>;
    obtener(id: number): Promise<T>;
    crear(datos: Record<string, unknown>): Promise<T>;
    actualizar(id: number, datos: Record<string, unknown>): Promise<T>;
    eliminar(id: number): Promise<T>;
}

// crea el service de una entidad: reglas de negocio comunes (404, etc.)
// sobre el repositorio generico. cada entidad expone su propia instancia
// para poder extenderla despues con logica particular si hace falta.
export function crearServicioCrud<T>(tabla: string): ServicioCrud<T> {
    return {
        async listar() {
            return repo.obtenerTodos(tabla) as Promise<T[]>;
        },
        async obtener(id) {
            const registro = await repo.obtenerPorId(tabla, id);
            if (!registro) throw new NotFoundError(tabla);
            return registro as T;
        },
        async crear(datos) {
            return repo.crear(tabla, datos) as Promise<T>;
        },
        async actualizar(id, datos) {
            const actualizado = await repo.actualizar(tabla, id, datos);
            if (!actualizado) throw new NotFoundError(tabla);
            return actualizado as T;
        },
        async eliminar(id) {
            const eliminado = await repo.eliminar(tabla, id);
            if (!eliminado) throw new NotFoundError(tabla);
            return eliminado as T;
        },
    };
}
