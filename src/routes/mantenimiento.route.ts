import { crearRutasCrud } from '../core/route.factory';
import { mantenimientoService } from '../services/mantenimiento.service';
import { mantenimientoSchema, mantenimientoUpdateSchema } from '../validators/mantenimiento.validator';

export const mantenimientoRoutes = crearRutasCrud(mantenimientoService, mantenimientoSchema, mantenimientoUpdateSchema);
