drop database if exists servitransportes_in5cm;
create database servitransportes_in5cm;
use servitransportes_in5cm;

create table cliente (
  id int auto_increment primary key,
  nombre_empresa varchar(100) not null,
  nit varchar(20) not null,
  telefono varchar(20),
  email varchar(100)
);
 
create table conductor (
  id int auto_increment primary key,
  nombre varchar(100) not null,
  dpi varchar(20) not null,
  licencia varchar(20) not null,
  tipo_licencia varchar(10) not null,
  estado varchar(20) default 'activo'
);
 
create table vehiculo (
  id int auto_increment primary key,
  placa varchar(15) not null,
  marca varchar(50) not null,
  tipo varchar(30) not null,
  capacidad_carga_kg float not null,
  estado varchar(20) default 'disponible'
);
 
create table ruta (
  id int auto_increment primary key,
  origen varchar(100) not null,
  destino varchar(100) not null,
  distancia_km float not null
);
 
create table envio (
  id int auto_increment primary key,
  cliente_id int not null,
  conductor_id int not null,
  vehiculo_id int not null,
  ruta_id int not null,
  fecha_salida date not null,
  fecha_llegada_est date not null,
  estado varchar(20) default 'programado',
  peso_carga_kg float not null,
  foreign key (cliente_id) references cliente(id),
  foreign key (conductor_id) references conductor(id),
  foreign key (vehiculo_id) references vehiculo(id),
  foreign key (ruta_id) references ruta(id)
);
 
create table mantenimiento (
  id int auto_increment primary key,
  vehiculo_id int not null,
  tipo varchar(50) not null,
  fecha date not null,
  costo float not null,
  kilometraje int not null,
  foreign key (vehiculo_id) references vehiculo(id)
);
 
create table combustible (
  id int auto_increment primary key,
  vehiculo_id int not null,
  conductor_id int not null,
  fecha date not null,
  litros float not null,
  costo float not null,
  foreign key (vehiculo_id) references vehiculo(id),
  foreign key (conductor_id) references conductor(id)
);
 
create table factura (
  id int auto_increment primary key,
  envio_id int not null,
  cliente_id int not null,
  subtotal float not null,
  iva float not null,
  total float not null,
  estado_pago varchar(20) default 'pendiente',
  foreign key (envio_id) references envio(id),
  foreign key (cliente_id) references cliente(id)
);
 
create table seguro (
  id int auto_increment primary key,
  vehiculo_id int not null,
  aseguradora varchar(100) not null,
  numero_poliza varchar(30) not null,
  fecha_vencimiento date not null,
  foreign key (vehiculo_id) references vehiculo(id)
);
 
create table incidente (
  id int auto_increment primary key,
  envio_id int not null,
  tipo varchar(50) not null,
  descripcion varchar(255),
  fecha date not null,
  foreign key (envio_id) references envio(id)
);

delimiter //
 
create procedure sp_insertar_cliente(
  in p_nombre_empresa varchar(100), in p_nit varchar(20),
  in p_telefono varchar(20), in p_email varchar(100)
)
begin
  insert into cliente (nombre_empresa, nit, telefono, email)
  values (p_nombre_empresa, p_nit, p_telefono, p_email);
end //
 
create procedure sp_insertar_conductor(
  in p_nombre varchar(100), in p_dpi varchar(20), in p_licencia varchar(20),
  in p_tipo_licencia varchar(10), in p_estado varchar(20)
)
begin
  insert into conductor (nombre, dpi, licencia, tipo_licencia, estado)
  values (p_nombre, p_dpi, p_licencia, p_tipo_licencia, p_estado);
end //
 
create procedure sp_insertar_vehiculo(
  in p_placa varchar(15), in p_marca varchar(50), in p_tipo varchar(30),
  in p_capacidad float, in p_estado varchar(20)
)
begin
  insert into vehiculo (placa, marca, tipo, capacidad_carga_kg, estado)
  values (p_placa, p_marca, p_tipo, p_capacidad, p_estado);
end //
 
create procedure sp_insertar_ruta(
  in p_origen varchar(100), in p_destino varchar(100), in p_distancia float
)
begin
  insert into ruta (origen, destino, distancia_km)
  values (p_origen, p_destino, p_distancia);
end //
 
create procedure sp_insertar_envio(
  in p_cliente_id int, in p_conductor_id int, in p_vehiculo_id int, in p_ruta_id int,
  in p_fecha_salida date, in p_fecha_llegada_est date, in p_estado varchar(20), in p_peso float
)
begin
  insert into envio (cliente_id, conductor_id, vehiculo_id, ruta_id, fecha_salida, fecha_llegada_est, estado, peso_carga_kg)
  values (p_cliente_id, p_conductor_id, p_vehiculo_id, p_ruta_id, p_fecha_salida, p_fecha_llegada_est, p_estado, p_peso);
end //
 
create procedure sp_insertar_mantenimiento(
  in p_vehiculo_id int, in p_tipo varchar(50), in p_fecha date, in p_costo float, in p_kilometraje int
)
begin
  insert into mantenimiento (vehiculo_id, tipo, fecha, costo, kilometraje)
  values (p_vehiculo_id, p_tipo, p_fecha, p_costo, p_kilometraje);
end //
 
create procedure sp_insertar_combustible(
  in p_vehiculo_id int, in p_conductor_id int, in p_fecha date, in p_litros float, in p_costo float
)
begin
  insert into combustible (vehiculo_id, conductor_id, fecha, litros, costo)
  values (p_vehiculo_id, p_conductor_id, p_fecha, p_litros, p_costo);
end //
 
create procedure sp_insertar_factura(
  in p_envio_id int, in p_cliente_id int, in p_subtotal float, in p_iva float, in p_total float, in p_estado_pago varchar(20)
)
begin
  insert into factura (envio_id, cliente_id, subtotal, iva, total, estado_pago)
  values (p_envio_id, p_cliente_id, p_subtotal, p_iva, p_total, p_estado_pago);
end //
 
create procedure sp_insertar_seguro(
  in p_vehiculo_id int, in p_aseguradora varchar(100), in p_numero_poliza varchar(30), in p_fecha_vencimiento date
)
begin
  insert into seguro (vehiculo_id, aseguradora, numero_poliza, fecha_vencimiento)
  values (p_vehiculo_id, p_aseguradora, p_numero_poliza, p_fecha_vencimiento);
end //
 
create procedure sp_insertar_incidente(
  in p_envio_id int, in p_tipo varchar(50), in p_descripcion varchar(255), in p_fecha date
)
begin
  insert into incidente (envio_id, tipo, descripcion, fecha)
  values (p_envio_id, p_tipo, p_descripcion, p_fecha);
end //
 
delimiter ;