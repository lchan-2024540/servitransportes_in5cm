import { crearServicioCrud } from '../core/service.factory';
import { Seguro } from '../models/seguro';

// service de la entidad 'seguro': logica de negocio sobre la tabla 'seguro'
export const seguroService = crearServicioCrud<Seguro>('seguro');
