import { crearRutasCrud } from '../core/route.factory';
import { envioService } from '../services/envio.service';
import { envioSchema, envioUpdateSchema } from '../validators/envio.validator';

export const envioRoutes = crearRutasCrud(envioService, envioSchema, envioUpdateSchema);
