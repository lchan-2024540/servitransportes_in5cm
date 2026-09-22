import { crearServicioCrud } from '../core/service.factory';
import { Conductor } from '../models/conductor';

// service de la entidad 'conductor': logica de negocio sobre la tabla 'conductor'
export const conductorService = crearServicioCrud<Conductor>('conductor');
