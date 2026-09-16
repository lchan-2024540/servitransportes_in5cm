import { crearControlador } from '../core/controller.factory';
import { entidades } from '../config/entidades.config';

const config = entidades.find((e) => e.tabla === 'incidente')!;

// controlador especifico de la entidad 'incidente'
// expone listar / obtener / crear / actualizar / eliminar ya validados
export const incidenteController = crearControlador(config.tabla, config.camposRequeridos);
