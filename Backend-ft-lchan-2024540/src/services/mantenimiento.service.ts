import { crearServicioCrud } from '../core/service.factory';
import { Mantenimiento } from '../models/mantenimiento';

// service de la entidad 'mantenimiento': logica de negocio sobre la tabla 'mantenimiento'
export const mantenimientoService = crearServicioCrud<Mantenimiento>('mantenimiento');
