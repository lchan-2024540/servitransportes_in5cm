create table cliente (
    id serial primary key,
    nombre varchar(100) not null,
    nit varchar(20),
    telefono varchar(20),
    correo varchar(100) unique,
    direccion varchar(150),
    fecha_registro timestamp default now()
);

create table conductor (
    id serial primary key,
    nombre varchar(100) not null,
    licencia varchar(30) not null unique,
    telefono varchar(20),
    correo varchar(100) unique,
    fecha_contratacion date,
    estado varchar(20) default 'activo'
);

create table vehiculo (
    id serial primary key,
    placa varchar(15) not null unique,
    marca varchar(50),
    modelo varchar(50),
    anio integer,
    capacidad_carga numeric(10,2),
    estado varchar(20) default 'disponible'
);

create table ruta (
    id serial primary key,
    origen varchar(100) not null,
    destino varchar(100) not null,
    distancia_km numeric(10,2),
    tiempo_estimado_horas numeric(5,2)
);

create table envio (
    id serial primary key,
    cliente_id integer references cliente(id),
    conductor_id integer references conductor(id),
    vehiculo_id integer references vehiculo(id),
    ruta_id integer references ruta(id),
    fecha_envio date not null,
    fecha_entrega date,
    estado varchar(20) default 'pendiente',
    peso_carga numeric(10,2)
);

create table mantenimiento (
    id serial primary key,
    vehiculo_id integer references vehiculo(id),
    fecha date not null,
    tipo varchar(50),
    costo numeric(10,2),
    descripcion varchar(200)
);

create table combustible (
    id serial primary key,
    vehiculo_id integer references vehiculo(id),
    fecha date not null,
    litros numeric(10,2),
    costo numeric(10,2),
    kilometraje integer
);

create table factura (
    id serial primary key,
    envio_id integer references envio(id),
    fecha_emision date default current_date,
    monto numeric(10,2) not null,
    iva numeric(10,2),
    total numeric(10,2),
    estado_pago varchar(20) default 'pendiente'
);

create table seguro (
    id serial primary key,
    vehiculo_id integer references vehiculo(id),
    aseguradora varchar(100),
    numero_poliza varchar(50),
    fecha_inicio date,
    fecha_vencimiento date,
    costo numeric(10,2)
);

create table incidente (
    id serial primary key,
    envio_id integer references envio(id),
    vehiculo_id integer references vehiculo(id),
    fecha date default current_date,
    tipo varchar(50),
    descripcion varchar(200),
    gravedad varchar(20)
);

-- =========================================================
-- procedimientos almacenados
-- =========================================================

create or replace procedure sp_insertar_cliente(
    p_nombre varchar,
    p_nit varchar,
    p_telefono varchar,
    p_correo varchar,
    p_direccion varchar
)
language plpgsql
as $$
begin
    insert into cliente (nombre, nit, telefono, correo, direccion)
    values (p_nombre, p_nit, p_telefono, p_correo, p_direccion);
end;
$$;

create or replace procedure sp_insertar_conductor(
    p_nombre varchar,
    p_licencia varchar,
    p_telefono varchar,
    p_correo varchar,
    p_fecha_contratacion date,
    p_estado varchar
)
language plpgsql
as $$
begin
    insert into conductor (nombre, licencia, telefono, correo, fecha_contratacion, estado)
    values (p_nombre, p_licencia, p_telefono, p_correo, p_fecha_contratacion, p_estado);
end;
$$;

create or replace procedure sp_insertar_vehiculo(
    p_placa varchar,
    p_marca varchar,
    p_modelo varchar,
    p_anio integer,
    p_capacidad_carga numeric,
    p_estado varchar
)
language plpgsql
as $$
begin
    insert into vehiculo (placa, marca, modelo, anio, capacidad_carga, estado)
    values (p_placa, p_marca, p_modelo, p_anio, p_capacidad_carga, p_estado);
end;
$$;

create or replace procedure sp_insertar_ruta(
    p_origen varchar,
    p_destino varchar,
    p_distancia_km numeric,
    p_tiempo_estimado_horas numeric
)
language plpgsql
as $$
begin
    insert into ruta (origen, destino, distancia_km, tiempo_estimado_horas)
    values (p_origen, p_destino, p_distancia_km, p_tiempo_estimado_horas);
end;
$$;

create or replace procedure sp_insertar_envio(
    p_cliente_id integer,
    p_conductor_id integer,
    p_vehiculo_id integer,
    p_ruta_id integer,
    p_fecha_envio date,
    p_fecha_entrega date,
    p_estado varchar,
    p_peso_carga numeric
)
language plpgsql
as $$
begin
    insert into envio (cliente_id, conductor_id, vehiculo_id, ruta_id, fecha_envio, fecha_entrega, estado, peso_carga)
    values (p_cliente_id, p_conductor_id, p_vehiculo_id, p_ruta_id, p_fecha_envio, p_fecha_entrega, p_estado, p_peso_carga);
end;
$$;

create or replace procedure sp_insertar_mantenimiento(
    p_vehiculo_id integer,
    p_fecha date,
    p_tipo varchar,
    p_costo numeric,
    p_descripcion varchar
)
language plpgsql
as $$
begin
    insert into mantenimiento (vehiculo_id, fecha, tipo, costo, descripcion)
    values (p_vehiculo_id, p_fecha, p_tipo, p_costo, p_descripcion);
end;
$$;

create or replace procedure sp_insertar_combustible(
    p_vehiculo_id integer,
    p_fecha date,
    p_litros numeric,
    p_costo numeric,
    p_kilometraje integer
)
language plpgsql
as $$
begin
    insert into combustible (vehiculo_id, fecha, litros, costo, kilometraje)
    values (p_vehiculo_id, p_fecha, p_litros, p_costo, p_kilometraje);
end;
$$;

create or replace procedure sp_insertar_factura(
    p_envio_id integer,
    p_fecha_emision date,
    p_monto numeric,
    p_iva numeric,
    p_total numeric,
    p_estado_pago varchar
)
language plpgsql
as $$
begin
    insert into factura (envio_id, fecha_emision, monto, iva, total, estado_pago)
    values (p_envio_id, p_fecha_emision, p_monto, p_iva, p_total, p_estado_pago);
end;
$$;

create or replace procedure sp_insertar_seguro(
    p_vehiculo_id integer,
    p_aseguradora varchar,
    p_numero_poliza varchar,
    p_fecha_inicio date,
    p_fecha_vencimiento date,
    p_costo numeric
)
language plpgsql
as $$
begin
    insert into seguro (vehiculo_id, aseguradora, numero_poliza, fecha_inicio, fecha_vencimiento, costo)
    values (p_vehiculo_id, p_aseguradora, p_numero_poliza, p_fecha_inicio, p_fecha_vencimiento, p_costo);
end;
$$;

create or replace procedure sp_insertar_incidente(
    p_envio_id integer,
    p_vehiculo_id integer,
    p_fecha date,
    p_tipo varchar,
    p_descripcion varchar,
    p_gravedad varchar
)
language plpgsql
as $$
begin
    insert into incidente (envio_id, vehiculo_id, fecha, tipo, descripcion, gravedad)
    values (p_envio_id, p_vehiculo_id, p_fecha, p_tipo, p_descripcion, p_gravedad);
end;
$$;

-- =========================================================
-- 10 registros por tabla (mediante call)
-- =========================================================

-- cliente
call sp_insertar_cliente('transportes del valle s.a.', '1234567-8', '22334455', 'contacto@delvalle.com', 'zona 4, guatemala');
call sp_insertar_cliente('agroexport gt', '2345678-9', '22445566', 'ventas@agroexport.gt', 'zona 12, guatemala');
call sp_insertar_cliente('comercial san miguel', '3456789-0', '22556677', 'info@sanmiguel.com', 'zona 1, quetzaltenango');
call sp_insertar_cliente('distribuidora del norte', '4567890-1', '22667788', 'contacto@delnorte.com', 'zona 3, coban');
call sp_insertar_cliente('ferretera central', '5678901-2', '22778899', 'ventas@ferreteracentral.com', 'zona 9, guatemala');
call sp_insertar_cliente('lacteos san jose', '6789012-3', '22889900', 'info@lacteossanjose.com', 'zona 2, chimaltenango');
call sp_insertar_cliente('constructora vertice', '7890123-4', '22990011', 'contacto@vertice.com', 'zona 15, guatemala');
call sp_insertar_cliente('industrias del cafe', '8901234-5', '23001122', 'ventas@delcafe.com', 'zona 1, antigua guatemala');
call sp_insertar_cliente('textiles guatemaltecos', '9012345-6', '23112233', 'info@textilesgt.com', 'zona 7, guatemala');
call sp_insertar_cliente('supermercados la union', '0123456-7', '23223344', 'contacto@launion.com', 'zona 5, escuintla');

-- conductor
call sp_insertar_conductor('carlos ramirez', 'a-1234567', '55112233', 'carlos.ramirez@servi.com', '2019-03-10', 'activo');
call sp_insertar_conductor('luis fernandez', 'a-2345678', '55223344', 'luis.fernandez@servi.com', '2020-06-15', 'activo');
call sp_insertar_conductor('maria lopez', 'a-3456789', '55334455', 'maria.lopez@servi.com', '2018-01-20', 'activo');
call sp_insertar_conductor('jorge morales', 'a-4567890', '55445566', 'jorge.morales@servi.com', '2021-09-05', 'activo');
call sp_insertar_conductor('ana garcia', 'a-5678901', '55556677', 'ana.garcia@servi.com', '2017-11-30', 'inactivo');
call sp_insertar_conductor('pedro sanchez', 'a-6789012', '55667788', 'pedro.sanchez@servi.com', '2022-02-14', 'activo');
call sp_insertar_conductor('rosa martinez', 'a-7890123', '55778899', 'rosa.martinez@servi.com', '2019-07-22', 'activo');
call sp_insertar_conductor('diego castillo', 'a-8901234', '55889900', 'diego.castillo@servi.com', '2020-12-01', 'activo');
call sp_insertar_conductor('sofia ortiz', 'a-9012345', '55990011', 'sofia.ortiz@servi.com', '2016-05-18', 'inactivo');
call sp_insertar_conductor('miguel torres', 'a-0123456', '56001122', 'miguel.torres@servi.com', '2023-01-09', 'activo');

-- vehiculo
call sp_insertar_vehiculo('p-123abc', 'volvo', 'fh16', 2019, 25000.00, 'disponible');
call sp_insertar_vehiculo('p-234bcd', 'scania', 'r450', 2020, 22000.00, 'disponible');
call sp_insertar_vehiculo('p-345cde', 'freightliner', 'cascadia', 2018, 20000.00, 'en ruta');
call sp_insertar_vehiculo('p-456def', 'mercedes benz', 'actros', 2021, 24000.00, 'disponible');
call sp_insertar_vehiculo('p-567efg', 'international', 'lonestar', 2017, 18000.00, 'mantenimiento');
call sp_insertar_vehiculo('p-678fgh', 'kenworth', 't680', 2022, 26000.00, 'disponible');
call sp_insertar_vehiculo('p-789ghi', 'volvo', 'vnl', 2019, 23000.00, 'en ruta');
call sp_insertar_vehiculo('p-890hij', 'scania', 'g410', 2020, 21000.00, 'disponible');
call sp_insertar_vehiculo('p-901ijk', 'mack', 'anthem', 2016, 19000.00, 'mantenimiento');
call sp_insertar_vehiculo('p-012jkl', 'peterbilt', '579', 2023, 27000.00, 'disponible');

-- ruta
call sp_insertar_ruta('guatemala', 'quetzaltenango', 205.00, 4.50);
call sp_insertar_ruta('guatemala', 'coban', 215.00, 5.00);
call sp_insertar_ruta('guatemala', 'escuintla', 60.00, 1.50);
call sp_insertar_ruta('guatemala', 'puerto barrios', 297.00, 6.00);
call sp_insertar_ruta('guatemala', 'chiquimula', 174.00, 3.50);
call sp_insertar_ruta('guatemala', 'huehuetenango', 266.00, 5.50);
call sp_insertar_ruta('guatemala', 'antigua guatemala', 45.00, 1.00);
call sp_insertar_ruta('guatemala', 'peten', 500.00, 9.00);
call sp_insertar_ruta('guatemala', 'zacapa', 145.00, 3.00);
call sp_insertar_ruta('guatemala', 'retalhuleu', 190.00, 4.00);

-- envio
call sp_insertar_envio(1, 1, 1, 1, '2026-08-01', '2026-08-02', 'entregado', 1200.50);
call sp_insertar_envio(2, 2, 2, 2, '2026-08-03', '2026-08-04', 'entregado', 3400.00);
call sp_insertar_envio(3, 3, 3, 3, '2026-08-05', null, 'en transito', 800.75);
call sp_insertar_envio(4, 4, 4, 4, '2026-08-06', '2026-08-08', 'entregado', 5600.00);
call sp_insertar_envio(5, 5, 5, 5, '2026-08-07', null, 'pendiente', 950.25);
call sp_insertar_envio(6, 6, 6, 6, '2026-08-08', '2026-08-10', 'entregado', 2100.00);
call sp_insertar_envio(7, 7, 7, 7, '2026-08-09', null, 'en transito', 3300.50);
call sp_insertar_envio(8, 8, 8, 8, '2026-08-10', '2026-08-12', 'entregado', 1750.00);
call sp_insertar_envio(9, 9, 9, 9, '2026-08-11', null, 'pendiente', 4200.75);
call sp_insertar_envio(10, 10, 10, 10, '2026-08-12', '2026-08-13', 'entregado', 990.00);

-- mantenimiento
call sp_insertar_mantenimiento(1, '2026-07-01', 'cambio de aceite', 450.00, 'mantenimiento preventivo de motor');
call sp_insertar_mantenimiento(2, '2026-07-05', 'revision de frenos', 600.00, 'cambio de pastillas y discos');
call sp_insertar_mantenimiento(3, '2026-07-10', 'alineacion', 250.00, 'alineacion y balanceo de llantas');
call sp_insertar_mantenimiento(4, '2026-07-15', 'cambio de llantas', 3200.00, 'cambio de las seis llantas traseras');
call sp_insertar_mantenimiento(5, '2026-07-20', 'reparacion de motor', 5400.00, 'reparacion de sistema de inyeccion');
call sp_insertar_mantenimiento(6, '2026-07-22', 'revision electrica', 380.00, 'revision de sistema electrico general');
call sp_insertar_mantenimiento(7, '2026-07-25', 'cambio de aceite', 470.00, 'mantenimiento preventivo de motor');
call sp_insertar_mantenimiento(8, '2026-07-28', 'revision de suspension', 900.00, 'cambio de amortiguadores');
call sp_insertar_mantenimiento(9, '2026-08-01', 'reparacion de transmision', 6200.00, 'reparacion de caja de cambios');
call sp_insertar_mantenimiento(10, '2026-08-03', 'revision general', 700.00, 'chequeo completo antes de viaje largo');

-- combustible
call sp_insertar_combustible(1, '2026-08-01', 180.50, 1450.00, 125000);
call sp_insertar_combustible(2, '2026-08-02', 200.00, 1600.00, 98000);
call sp_insertar_combustible(3, '2026-08-03', 150.75, 1200.00, 76000);
call sp_insertar_combustible(4, '2026-08-04', 220.00, 1750.00, 54000);
call sp_insertar_combustible(5, '2026-08-05', 175.25, 1400.00, 143000);
call sp_insertar_combustible(6, '2026-08-06', 190.00, 1520.00, 32000);
call sp_insertar_combustible(7, '2026-08-07', 210.50, 1680.00, 87000);
call sp_insertar_combustible(8, '2026-08-08', 165.00, 1320.00, 65000);
call sp_insertar_combustible(9, '2026-08-09', 230.75, 1850.00, 156000);
call sp_insertar_combustible(10, '2026-08-10', 140.00, 1120.00, 21000);

-- factura
call sp_insertar_factura(1, '2026-08-02', 3500.00, 420.00, 3920.00, 'pagado');
call sp_insertar_factura(2, '2026-08-04', 6200.00, 744.00, 6944.00, 'pagado');
call sp_insertar_factura(3, '2026-08-05', 1800.00, 216.00, 2016.00, 'pendiente');
call sp_insertar_factura(4, '2026-08-08', 9500.00, 1140.00, 10640.00, 'pagado');
call sp_insertar_factura(5, '2026-08-07', 2100.00, 252.00, 2352.00, 'pendiente');
call sp_insertar_factura(6, '2026-08-10', 4300.00, 516.00, 4816.00, 'pagado');
call sp_insertar_factura(7, '2026-08-09', 5600.00, 672.00, 6272.00, 'pendiente');
call sp_insertar_factura(8, '2026-08-12', 3100.00, 372.00, 3472.00, 'pagado');
call sp_insertar_factura(9, '2026-08-11', 7200.00, 864.00, 8064.00, 'pendiente');
call sp_insertar_factura(10, '2026-08-13', 1950.00, 234.00, 2184.00, 'pagado');

-- seguro
call sp_insertar_seguro(1, 'aseguradora g&t', 'pol-10001', '2026-01-01', '2027-01-01', 4500.00);
call sp_insertar_seguro(2, 'seguros universales', 'pol-10002', '2026-02-01', '2027-02-01', 4700.00);
call sp_insertar_seguro(3, 'aseguradora g&t', 'pol-10003', '2026-03-01', '2027-03-01', 4300.00);
call sp_insertar_seguro(4, 'columna', 'pol-10004', '2026-04-01', '2027-04-01', 5000.00);
call sp_insertar_seguro(5, 'seguros universales', 'pol-10005', '2026-05-01', '2027-05-01', 4600.00);
call sp_insertar_seguro(6, 'aseguradora g&t', 'pol-10006', '2026-06-01', '2027-06-01', 4800.00);
call sp_insertar_seguro(7, 'columna', 'pol-10007', '2026-07-01', '2027-07-01', 4900.00);
call sp_insertar_seguro(8, 'seguros universales', 'pol-10008', '2026-08-01', '2027-08-01', 4400.00);
call sp_insertar_seguro(9, 'aseguradora g&t', 'pol-10009', '2026-09-01', '2027-09-01', 5100.00);
call sp_insertar_seguro(10, 'columna', 'pol-10010', '2026-10-01', '2027-10-01', 4750.00);

-- incidente
call sp_insertar_incidente(1, 1, '2026-08-01', 'retraso', 'retraso por trafico en carretera', 'baja');
call sp_insertar_incidente(2, 2, '2026-08-03', 'averia mecanica', 'falla en el sistema de frenos', 'media');
call sp_insertar_incidente(3, 3, '2026-08-05', 'accidente menor', 'colision leve en cruce vehicular', 'media');
call sp_insertar_incidente(4, 4, '2026-08-06', 'retraso', 'retraso por condiciones climaticas', 'baja');
call sp_insertar_incidente(5, 5, '2026-08-07', 'perdida de carga', 'daño parcial de mercaderia', 'alta');
call sp_insertar_incidente(6, 6, '2026-08-08', 'averia mecanica', 'falla en el motor durante el trayecto', 'alta');
call sp_insertar_incidente(7, 7, '2026-08-09', 'retraso', 'retraso por cierre de via', 'baja');
call sp_insertar_incidente(8, 8, '2026-08-10', 'accidente menor', 'impacto leve en zona de carga', 'media');
call sp_insertar_incidente(9, 9, '2026-08-11', 'robo parcial', 'sustraccion de parte de la mercaderia', 'alta');
call sp_insertar_incidente(10, 10, '2026-08-12', 'retraso', 'retraso por revision aduanal', 'baja');
