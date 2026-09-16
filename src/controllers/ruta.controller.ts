import { crearControlador } from '../core/controller.factory';
import { entidades } from '../config/entidades.config';

const config = entidades.find((e) => e.tabla === 'ruta')!;

// controlador especifico de la entidad 'ruta'
// expone listar / obtener / crear / actualizar / eliminar ya validados
export const rutaController = crearControlador(config.tabla, config.camposRequeridos);
