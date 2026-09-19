import { crearServicioCrud } from '../core/service.factory';
import { Vehiculo } from '../models/vehiculo';

// service de la entidad 'vehiculo': logica de negocio sobre la tabla 'vehiculo'
export const vehiculoService = crearServicioCrud<Vehiculo>('vehiculo');
