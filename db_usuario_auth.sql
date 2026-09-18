-- =========================================================
-- script incremental: agrega autenticacion de usuarios
-- no modifica ni elimina ninguna de las 10 tablas originales
-- correr una sola vez, DESPUES de Servitransportes_in5cm.sql
-- =========================================================

create table if not exists usuario (
    id serial primary key,
    nombre varchar(100) not null,
    apellido varchar(100) not null,
    email varchar(100) not null unique,
    telefono varchar(20),
    password_hash varchar(255) not null,
    fecha_registro timestamp default now()
);

create or replace procedure sp_insertar_usuario(
    p_nombre varchar,
    p_apellido varchar,
    p_email varchar,
    p_telefono varchar,
    p_password_hash varchar
)
language plpgsql
as $$
begin
    insert into usuario (nombre, apellido, email, telefono, password_hash)
    values (p_nombre, p_apellido, p_email, p_telefono, p_password_hash);
end;
$$;

-- nota: las contraseñas se hashean en el backend (bcrypt) antes de llegar aqui,
-- por eso este script no inserta usuarios de prueba con contraseñas en texto plano.
-- registra tu primer usuario real desde POST /api/auth/registro una vez el
-- backend este corriendo.
