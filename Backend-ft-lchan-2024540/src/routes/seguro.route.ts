import { crearRutasCrud } from '../core/route.factory';
import { seguroService } from '../services/seguro.service';
import { seguroSchema, seguroUpdateSchema } from '../validators/seguro.validator';

export const seguroRoutes = crearRutasCrud(seguroService, seguroSchema, seguroUpdateSchema);
