import { crearRutasCrud } from '../core/route.factory';
import { ordenCompraService } from '../services/ordenCompra.service';
import { ordenCompraSchema, ordenCompraUpdateSchema } from '../validators/ordenCompra.validator';

export const ordenCompraRoutes = crearRutasCrud(ordenCompraService, ordenCompraSchema, ordenCompraUpdateSchema);
