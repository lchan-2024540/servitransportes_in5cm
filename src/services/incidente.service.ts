import { crearServicioCrud } from '../core/service.factory';
import { Incidente } from '../models/incidente';

// service de la entidad 'incidente': logica de negocio sobre la tabla 'incidente'
export const incidenteService = crearServicioCrud<Incidente>('incidente');
