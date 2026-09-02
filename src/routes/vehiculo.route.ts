import { crearRutasCrud } from '../core/route.factory';
import { vehiculoService } from '../services/vehiculo.service';
import { vehiculoSchema, vehiculoUpdateSchema } from '../validators/vehiculo.validator';

export const vehiculoRoutes = crearRutasCrud(vehiculoService, vehiculoSchema, vehiculoUpdateSchema);
