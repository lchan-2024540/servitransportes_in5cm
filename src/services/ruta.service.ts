import { crearServicioCrud } from '../core/service.factory';
import { Ruta } from '../models/ruta';

// service de la entidad 'ruta': logica de negocio sobre la tabla 'ruta'
export const rutaService = crearServicioCrud<Ruta>('ruta');
