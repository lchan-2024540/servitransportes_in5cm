import { crearServicioCrud } from '../core/service.factory';
import { Envio } from '../models/envio';

// service de la entidad 'envio': logica de negocio sobre la tabla 'envio'
export const envioService = crearServicioCrud<Envio>('envio');
