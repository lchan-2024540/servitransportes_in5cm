import { crearControlador } from '../core/controller.factory';
import { entidades } from '../config/entidades.config';

const config = entidades.find((e) => e.tabla === 'cliente')!;

// controlador especifico de la entidad 'cliente'
// expone listar / obtener / crear / actualizar / eliminar ya validados
export const clienteController = crearControlador(config.tabla, config.camposRequeridos);
