import { crearControlador } from '../core/controller.factory';
import { entidades } from '../config/entidades.config';

const config = entidades.find((e) => e.tabla === 'vehiculo')!;

// controlador especifico de la entidad 'vehiculo'
// expone listar / obtener / crear / actualizar / eliminar ya validados
export const vehiculoController = crearControlador(config.tabla, config.camposRequeridos);
