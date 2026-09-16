import { crearControlador } from '../core/controller.factory';
import { entidades } from '../config/entidades.config';

const config = entidades.find((e) => e.tabla === 'combustible')!;

// controlador especifico de la entidad 'combustible'
// expone listar / obtener / crear / actualizar / eliminar ya validados
export const combustibleController = crearControlador(config.tabla, config.camposRequeridos);
