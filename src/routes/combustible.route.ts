import { crearRutasCrud } from '../core/route.factory';
import { combustibleService } from '../services/combustible.service';
import { combustibleSchema, combustibleUpdateSchema } from '../validators/combustible.validator';

export const combustibleRoutes = crearRutasCrud(combustibleService, combustibleSchema, combustibleUpdateSchema);
