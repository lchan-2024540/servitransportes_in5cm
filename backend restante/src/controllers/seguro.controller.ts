import { crearControlador } from '../core/controller.factory';
import { entidades } from '../config/entidades.config';

const config = entidades.find((e) => e.tabla === 'seguro')!;

// controlador especifico de la entidad 'seguro'
// expone listar / obtener / crear / actualizar / eliminar ya validados
export const seguroController = crearControlador(config.tabla, config.camposRequeridos);
