import http from 'http';
import dotenv from 'dotenv';
import { manejarPeticion } from './routes/router';

dotenv.config();

const PUERTO = process.env.PORT || 3000;

const servidor = http.createServer((req, res) => {
    manejarPeticion(req, res);
});

servidor.listen(PUERTO, () => {
    console.log(`servidor corriendo en http://localhost:${PUERTO}`);
    console.log('endpoints disponibles: /api/clientes, /api/conductores, /api/vehiculos, /api/rutas, /api/envios, /api/mantenimientos, /api/combustibles, /api/facturas, /api/seguros, /api/incidentes');
});
