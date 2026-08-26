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