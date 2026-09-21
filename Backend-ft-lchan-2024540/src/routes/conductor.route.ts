import { crearRutasCrud } from '../core/route.factory';
import { conductorService } from '../services/conductor.service';
import { conductorSchema, conductorUpdateSchema } from '../validators/conductor.validator';

export const conductorRoutes = crearRutasCrud(conductorService, conductorSchema, conductorUpdateSchema);
