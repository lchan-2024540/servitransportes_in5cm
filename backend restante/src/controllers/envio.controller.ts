import { crearControlador } from '../core/controller.factory';
import { entidades } from '../config/entidades.config';

const config = entidades.find((e) => e.tabla === 'envio')!;

// controlador especifico de la entidad 'envio'
// expone listar / obtener / crear / actualizar / eliminar ya validados
export const envioController = crearControlador(config.tabla, config.camposRequeridos);
