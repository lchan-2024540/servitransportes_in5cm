import { Controlador } from '../core/controller.factory';
import { clienteController } from './cliente.controller';
import { conductorController } from './conductor.controller';
import { vehiculoController } from './vehiculo.controller';
import { rutaController } from './ruta.controller';
import { envioController } from './envio.controller';
import { mantenimientoController } from './mantenimiento.controller';
import { combustibleController } from './combustible.controller';
import { facturaController } from './factura.controller';
import { seguroController } from './seguro.controller';
import { incidenteController } from './incidente.controller';

// mapa: ruta http (/api/<ruta>) -> controlador de la entidad correspondiente
export const controladores: Record<string, Controlador> = {
    clientes: clienteController,
    conductores: conductorController,
    vehiculos: vehiculoController,
    rutas: rutaController,
    envios: envioController,
    mantenimientos: mantenimientoController,
    combustibles: combustibleController,
    facturas: facturaController,
    seguros: seguroController,
    incidentes: incidenteController,
};
