import { crearServicioCrud } from '../core/service.factory';
import { Cliente } from '../models/cliente';

// service de la entidad 'cliente': logica de negocio sobre la tabla 'cliente'
export const clienteService = crearServicioCrud<Cliente>('cliente');
