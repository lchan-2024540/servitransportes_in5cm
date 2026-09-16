import { crearControlador } from '../core/controller.factory';
import { entidades } from '../config/entidades.config';

const config = entidades.find((e) => e.tabla === 'conductor')!;

// controlador especifico de la entidad 'conductor'
// expone listar / obtener / crear / actualizar / eliminar ya validados
export const conductorController = crearControlador(config.tabla, config.camposRequeridos);
