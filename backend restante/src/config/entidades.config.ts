export interface EntidadConfig {
    ruta: string;
    tabla: string;
    // campos obligatorios (not null en la base de datos, sin contar el id)
    camposRequeridos: string[];
}

export const entidades: EntidadConfig[] = [
    { ruta: 'clientes', tabla: 'cliente', camposRequeridos: ['nombre_empresa', 'nit'] },
    { ruta: 'conductores', tabla: 'conductor', camposRequeridos: ['nombre', 'dpi', 'licencia', 'tipo_licencia'] },
    { ruta: 'vehiculos', tabla: 'vehiculo', camposRequeridos: ['placa', 'marca', 'tipo', 'capacidad_carga_kg'] },
    { ruta: 'rutas', tabla: 'ruta', camposRequeridos: ['origen', 'destino', 'distancia_km'] },
    { ruta: 'envios', tabla: 'envio', camposRequeridos: ['cliente_id', 'conductor_id', 'vehiculo_id', 'ruta_id', 'fecha_salida', 'fecha_llegada_est', 'peso_carga_kg'] },
    { ruta: 'mantenimientos', tabla: 'mantenimiento', camposRequeridos: ['vehiculo_id', 'tipo', 'fecha', 'costo', 'kilometraje'] },
    { ruta: 'combustibles', tabla: 'combustible', camposRequeridos: ['vehiculo_id', 'conductor_id', 'fecha', 'litros', 'costo'] },
    { ruta: 'facturas', tabla: 'factura', camposRequeridos: ['envio_id', 'cliente_id', 'subtotal', 'iva', 'total'] },
    { ruta: 'seguros', tabla: 'seguro', camposRequeridos: ['vehiculo_id', 'aseguradora', 'numero_poliza', 'fecha_vencimiento'] },
    { ruta: 'incidentes', tabla: 'incidente', camposRequeridos: ['envio_id', 'tipo', 'fecha'] },
];
