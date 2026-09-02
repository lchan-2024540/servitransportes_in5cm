import { crearRutasCrud } from '../core/route.factory';
import { rutaService } from '../services/ruta.service';
import { rutaSchema, rutaUpdateSchema } from '../validators/ruta.validator';

export const rutaRoutes = crearRutasCrud(rutaService, rutaSchema, rutaUpdateSchema);
