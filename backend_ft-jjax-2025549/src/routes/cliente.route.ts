import { crearRutasCrud } from '../core/route.factory';
import { clienteService } from '../services/cliente.service';
import { clienteSchema, clienteUpdateSchema } from '../validators/cliente.validator';

export const clienteRoutes = crearRutasCrud(clienteService, clienteSchema, clienteUpdateSchema);
