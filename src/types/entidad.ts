export interface EntidadConfig {
    ruta: string;
    tabla: string;
}
export const entidades: EntidadConfig[] = [
    { ruta: 'clientes', tabla: 'cliente' },
    { ruta: 'conductores', tabla: 'conductor' },
    { ruta: 'vehiculos', tabla: 'vehiculo' },
    { ruta: 'rutas', tabla: 'ruta' },
    { ruta: 'envios', tabla: 'envio' },
    { ruta: 'mantenimientos', tabla: 'mantenimiento' },
    { ruta: 'combustibles', tabla: 'combustible' },
    { ruta: 'facturas', tabla: 'factura' },
    { ruta: 'seguros', tabla: 'seguro' },
    { ruta: 'incidentes', tabla: 'incidente' },
];
