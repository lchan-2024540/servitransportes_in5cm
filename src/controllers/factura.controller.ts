import { crearControlador } from '../core/controller.factory';
import { entidades } from '../config/entidades.config';

const config = entidades.find((e) => e.tabla === 'factura')!;

// controlador especifico de la entidad 'factura'
// expone listar / obtener / crear / actualizar / eliminar ya validados
export const facturaController = crearControlador(config.tabla, config.camposRequeridos);
