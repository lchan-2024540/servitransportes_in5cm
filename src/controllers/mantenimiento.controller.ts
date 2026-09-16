import { crearControlador } from '../core/controller.factory';
import { entidades } from '../config/entidades.config';

const config = entidades.find((e) => e.tabla === 'mantenimiento')!;

// controlador especifico de la entidad 'mantenimiento'
// expone listar / obtener / crear / actualizar / eliminar ya validados
export const mantenimientoController = crearControlador(config.tabla, config.camposRequeridos);
