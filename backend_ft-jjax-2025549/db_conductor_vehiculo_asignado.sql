-- =========================================================
-- script incremental: liga cada cuenta de usuario con rol 'conductor'
-- a su registro real en "conductor", y asigna un camion (vehiculo)
-- por defecto a cada conductor. no modifica ni elimina nada existente.
-- correr una sola vez, DESPUES de los scripts anteriores.
-- =========================================================

alter table usuario add column if not exists conductor_id integer references conductor(id);
alter table conductor add column if not exists vehiculo_id integer references vehiculo(id);

-- ejemplo: asigna los primeros 10 vehiculos a los primeros 10 conductores,
-- uno a uno (ajusta segun tu flota real si no coinciden 1 a 1)
update conductor set vehiculo_id = id where vehiculo_id is null and id <= 10;
