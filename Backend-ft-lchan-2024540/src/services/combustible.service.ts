import { crearServicioCrud } from '../core/service.factory';
import { Combustible } from '../models/combustible';

// service de la entidad 'combustible': logica de negocio sobre la tabla 'combustible'
export const combustibleService = crearServicioCrud<Combustible>('combustible');
