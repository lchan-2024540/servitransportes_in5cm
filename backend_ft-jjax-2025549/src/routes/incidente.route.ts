import { crearRutasCrud } from '../core/route.factory';
import { incidenteService } from '../services/incidente.service';
import { incidenteSchema, incidenteUpdateSchema } from '../validators/incidente.validator';

export const incidenteRoutes = crearRutasCrud(incidenteService, incidenteSchema, incidenteUpdateSchema);
