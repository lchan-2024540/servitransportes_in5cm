import { ConfigEntidad } from './entidad.model';

// configuracion unica que alimenta el menu, las tablas y los formularios
// de las 10 entidades. las claves (key) coinciden exactamente con las
// columnas que espera el backend (ver src/models y src/validators alla).
export const ENTIDADES: ConfigEntidad[] = [
    {
        clave: 'clientes', titulo: 'Clientes', tituloSingular: 'Cliente', icono: 'bi-people',
        campos: [
            { key: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true },
            { key: 'nit', etiqueta: 'NIT', tipo: 'text' },
            { key: 'telefono', etiqueta: 'Teléfono', tipo: 'tel' },
            { key: 'correo', etiqueta: 'Correo', tipo: 'email' },
            { key: 'direccion', etiqueta: 'Dirección', tipo: 'text' },
        ],
        columnasTabla: ['id', 'nombre', 'nit', 'telefono', 'correo'],
        rolesLectura: ['admin'],
        rolesEscritura: ['admin'],
    },
    {
        clave: 'conductores', titulo: 'Conductores', tituloSingular: 'Conductor', icono: 'bi-person-badge',
        campos: [
            { key: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true },
            { key: 'licencia', etiqueta: 'Licencia', tipo: 'text', requerido: true },
            { key: 'telefono', etiqueta: 'Teléfono', tipo: 'tel' },
            { key: 'correo', etiqueta: 'Correo', tipo: 'email' },
            { key: 'fecha_contratacion', etiqueta: 'Fecha de contratación', tipo: 'date' },
            { key: 'estado', etiqueta: 'Estado', tipo: 'select', opciones: ['activo', 'inactivo'] },
            { key: 'vehiculo_id', etiqueta: 'ID camión asignado', tipo: 'number' },
        ],
        columnasTabla: ['id', 'nombre', 'licencia', 'telefono', 'vehiculo_id', 'estado'],
        rolesLectura: ['admin'],
        rolesEscritura: ['admin'],
    },
    {
        clave: 'vehiculos', titulo: 'Vehículos', tituloSingular: 'Vehículo', icono: 'bi-truck',
        campos: [
            { key: 'placa', etiqueta: 'Placa', tipo: 'text', requerido: true },
            { key: 'marca', etiqueta: 'Marca', tipo: 'text' },
            { key: 'modelo', etiqueta: 'Modelo', tipo: 'text' },
            { key: 'anio', etiqueta: 'Año', tipo: 'number' },
            { key: 'capacidad_carga', etiqueta: 'Capacidad de carga (kg)', tipo: 'number' },
            { key: 'estado', etiqueta: 'Estado', tipo: 'select', opciones: ['disponible', 'en ruta', 'mantenimiento'] },
        ],
        columnasTabla: ['id', 'placa', 'marca', 'modelo', 'estado'],
        rolesLectura: ['admin'],
        rolesEscritura: ['admin'],
    },
    {
        clave: 'rutas', titulo: 'Rutas', tituloSingular: 'Ruta', icono: 'bi-signpost-2',
        campos: [
            { key: 'origen', etiqueta: 'Origen', tipo: 'text', requerido: true },
            { key: 'destino', etiqueta: 'Destino', tipo: 'text', requerido: true },
            { key: 'distancia_km', etiqueta: 'Distancia (km)', tipo: 'number' },
            { key: 'tiempo_estimado_horas', etiqueta: 'Tiempo estimado (h)', tipo: 'number' },
        ],
        columnasTabla: ['id', 'origen', 'destino', 'distancia_km'],
        rolesLectura: ['admin', 'conductor'],
        rolesEscritura: ['admin'],
    },
    {
        clave: 'envios', titulo: 'Viajes', tituloSingular: 'Viaje', icono: 'bi-box-seam',
        campos: [
            { key: 'cliente_id', etiqueta: 'ID cliente', tipo: 'number', requerido: true },
            { key: 'conductor_id', etiqueta: 'ID conductor', tipo: 'number', requerido: true },
            { key: 'vehiculo_id', etiqueta: 'ID vehículo (camión de volteo)', tipo: 'number', requerido: true },
            { key: 'ruta_id', etiqueta: 'ID ruta', tipo: 'number', requerido: true },
            { key: 'fecha_envio', etiqueta: 'Fecha del viaje', tipo: 'date', requerido: true },
            { key: 'fecha_entrega', etiqueta: 'Fecha de descarga', tipo: 'date' },
            { key: 'estado', etiqueta: 'Estado', tipo: 'select', opciones: ['programado', 'cargando', 'en camino', 'descargado'] },
            { key: 'peso_carga', etiqueta: 'Peso del material (kg)', tipo: 'number' },
        ],
        columnasTabla: ['id', 'cliente_id', 'fecha_envio', 'estado'],
        rolesLectura: ['admin', 'conductor'],
        rolesEscritura: ['admin'],
    },
    {
        clave: 'mantenimientos', titulo: 'Mantenimientos', tituloSingular: 'Mantenimiento', icono: 'bi-tools',
        campos: [
            { key: 'vehiculo_id', etiqueta: 'ID vehículo', tipo: 'number', requerido: true },
            { key: 'fecha', etiqueta: 'Fecha', tipo: 'date', requerido: true },
            { key: 'tipo', etiqueta: 'Tipo', tipo: 'text' },
            { key: 'costo', etiqueta: 'Costo', tipo: 'number' },
            { key: 'descripcion', etiqueta: 'Descripción', tipo: 'text' },
        ],
        columnasTabla: ['id', 'vehiculo_id', 'fecha', 'tipo', 'costo'],
        rolesLectura: ['admin', 'conductor'],
        rolesEscritura: ['admin', 'conductor'],
    },
    {
        clave: 'combustibles', titulo: 'Combustibles', tituloSingular: 'Combustible', icono: 'bi-fuel-pump',
        campos: [
            { key: 'vehiculo_id', etiqueta: 'ID vehículo', tipo: 'number', requerido: true },
            { key: 'fecha', etiqueta: 'Fecha', tipo: 'date', requerido: true },
            { key: 'litros', etiqueta: 'Litros', tipo: 'number' },
            { key: 'costo', etiqueta: 'Costo', tipo: 'number' },
            { key: 'kilometraje', etiqueta: 'Kilometraje', tipo: 'number' },
        ],
        columnasTabla: ['id', 'vehiculo_id', 'fecha', 'litros', 'costo'],
        rolesLectura: ['admin', 'conductor'],
        rolesEscritura: ['admin', 'conductor'],
    },
    {
        clave: 'facturas', titulo: 'Facturas', tituloSingular: 'Factura', icono: 'bi-receipt',
        campos: [
            { key: 'orden_compra_id', etiqueta: 'ID orden de compra', tipo: 'number', requerido: true },
            { key: 'envio_id', etiqueta: 'ID viaje (opcional)', tipo: 'number' },
            { key: 'fecha_emision', etiqueta: 'Fecha de emisión', tipo: 'date' },
            { key: 'monto', etiqueta: 'Monto', tipo: 'number', requerido: true },
            { key: 'iva', etiqueta: 'IVA', tipo: 'number' },
            { key: 'total', etiqueta: 'Total', tipo: 'number' },
            { key: 'estado_pago', etiqueta: 'Estado de pago', tipo: 'select', opciones: ['pendiente', 'pagado'] },
        ],
        columnasTabla: ['id', 'orden_compra_id', 'monto', 'total', 'estado_pago'],
        rolesLectura: ['admin'],
        rolesEscritura: ['admin'],
    },
    {
        clave: 'seguros', titulo: 'Seguros', tituloSingular: 'Seguro', icono: 'bi-shield-check',
        campos: [
            { key: 'vehiculo_id', etiqueta: 'ID vehículo', tipo: 'number', requerido: true },
            { key: 'aseguradora', etiqueta: 'Aseguradora', tipo: 'text' },
            { key: 'numero_poliza', etiqueta: 'N° de póliza', tipo: 'text' },
            { key: 'fecha_inicio', etiqueta: 'Fecha de inicio', tipo: 'date' },
            { key: 'fecha_vencimiento', etiqueta: 'Fecha de vencimiento', tipo: 'date' },
            { key: 'costo', etiqueta: 'Costo', tipo: 'number' },
        ],
        columnasTabla: ['id', 'vehiculo_id', 'aseguradora', 'fecha_vencimiento'],
        rolesLectura: ['admin'],
        rolesEscritura: ['admin'],
    },
    {
        clave: 'incidentes', titulo: 'Incidentes', tituloSingular: 'Incidente', icono: 'bi-exclamation-triangle',
        campos: [
            { key: 'envio_id', etiqueta: 'ID envío', tipo: 'number', requerido: true },
            { key: 'vehiculo_id', etiqueta: 'ID vehículo', tipo: 'number', requerido: true },
            { key: 'fecha', etiqueta: 'Fecha', tipo: 'date' },
            { key: 'tipo', etiqueta: 'Tipo', tipo: 'text' },
            { key: 'descripcion', etiqueta: 'Descripción', tipo: 'text' },
            { key: 'gravedad', etiqueta: 'Gravedad', tipo: 'select', opciones: ['baja', 'media', 'alta'] },
        ],
        columnasTabla: ['id', 'envio_id', 'tipo', 'gravedad'],
        rolesLectura: ['admin', 'conductor'],
        rolesEscritura: ['admin', 'conductor'],
    },    {
        clave: 'ordenes-compra', titulo: 'Órdenes de compra', tituloSingular: 'Orden de compra', icono: 'bi-file-earmark-text',
        campos: [
            { key: 'nit', etiqueta: 'NIT', tipo: 'text', requerido: true },
            { key: 'cliente_id', etiqueta: 'ID cliente', tipo: 'number', requerido: true },
            { key: 'fecha', etiqueta: 'Fecha', tipo: 'date' },
            { key: 'total', etiqueta: 'Total', tipo: 'number' },
        ],
        columnasTabla: ['id', 'nit', 'cliente_id', 'fecha', 'total'],
        rolesLectura: ['admin'],
        rolesEscritura: ['admin'],
    },
];

export function buscarEntidad(clave: string): ConfigEntidad | undefined {
    return ENTIDADES.find((e) => e.clave === clave);
}
