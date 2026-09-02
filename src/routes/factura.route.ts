import { crearRutasCrud } from '../core/route.factory';
import { facturaService } from '../services/factura.service';
import { facturaSchema, facturaUpdateSchema } from '../validators/factura.validator';

export const facturaRoutes = crearRutasCrud(facturaService, facturaSchema, facturaUpdateSchema);
