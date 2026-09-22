import { crearServicioCrud } from '../core/service.factory';
import { Factura } from '../models/factura';

// service de la entidad 'factura': logica de negocio sobre la tabla 'factura'
export const facturaService = crearServicioCrud<Factura>('factura');
