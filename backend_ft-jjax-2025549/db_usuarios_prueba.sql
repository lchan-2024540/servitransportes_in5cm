-- =========================================================
-- cuentas de prueba con contraseña real (ya hasheada con bcrypt,
-- compatible con bcryptjs) para poder iniciar sesion sin tener
-- que registrarte manualmente desde la app.
-- correr una sola vez, DESPUES de los scripts anteriores
-- (necesita que usuario.rol y usuario.conductor_id ya existan,
-- y que los 10 conductores del script original ya esten creados).
-- =========================================================

-- cuenta admin
-- correo:     admin@servitransportes.com
-- contraseña: Admin1234
insert into usuario (nombre, apellido, email, telefono, password_hash, rol)
values (
    'Admin', 'Principal', 'admin@servitransportes.com', '22334455',
    '$2b$10$0ekx3N.zPhj8iTtpRFTZIe/IZsFgwFlHoQYmvFwn2JIXVRALQb3Ve',
    'admin'
)
on conflict (email) do nothing;

-- cuentas de los 10 conductores, todas con la misma contraseña de prueba:
-- contraseña: Conductor1234
-- cada una ligada a su conductor real (mismo id que ya tiene su vehiculo
-- asignado desde db_conductor_vehiculo_asignado.sql)
insert into usuario (nombre, apellido, email, telefono, password_hash, rol, conductor_id)
values (
    'Carlos', 'Ramirez', 'conductor1@servitransportes.com', '55112233',
    '$2b$10$3wFncOyNgft./FpJDiokauZy/n.N00P.CGDmFjpS6dRBv19Oap5AC',
    'conductor', 1
)
on conflict (email) do nothing;

insert into usuario (nombre, apellido, email, telefono, password_hash, rol, conductor_id)
values (
    'Luis', 'Fernandez', 'conductor2@servitransportes.com', '55223344',
    '$2b$10$3wFncOyNgft./FpJDiokauZy/n.N00P.CGDmFjpS6dRBv19Oap5AC',
    'conductor', 2
)
on conflict (email) do nothing;

insert into usuario (nombre, apellido, email, telefono, password_hash, rol, conductor_id)
values (
    'Maria', 'Lopez', 'conductor3@servitransportes.com', '55334455',
    '$2b$10$3wFncOyNgft./FpJDiokauZy/n.N00P.CGDmFjpS6dRBv19Oap5AC',
    'conductor', 3
)
on conflict (email) do nothing;

insert into usuario (nombre, apellido, email, telefono, password_hash, rol, conductor_id)
values (
    'Jorge', 'Morales', 'conductor4@servitransportes.com', '55445566',
    '$2b$10$3wFncOyNgft./FpJDiokauZy/n.N00P.CGDmFjpS6dRBv19Oap5AC',
    'conductor', 4
)
on conflict (email) do nothing;

insert into usuario (nombre, apellido, email, telefono, password_hash, rol, conductor_id)
values (
    'Ana', 'Garcia', 'conductor5@servitransportes.com', '55556677',
    '$2b$10$3wFncOyNgft./FpJDiokauZy/n.N00P.CGDmFjpS6dRBv19Oap5AC',
    'conductor', 5
)
on conflict (email) do nothing;

insert into usuario (nombre, apellido, email, telefono, password_hash, rol, conductor_id)
values (
    'Pedro', 'Sanchez', 'conductor6@servitransportes.com', '55667788',
    '$2b$10$3wFncOyNgft./FpJDiokauZy/n.N00P.CGDmFjpS6dRBv19Oap5AC',
    'conductor', 6
)
on conflict (email) do nothing;

insert into usuario (nombre, apellido, email, telefono, password_hash, rol, conductor_id)
values (
    'Rosa', 'Martinez', 'conductor7@servitransportes.com', '55778899',
    '$2b$10$3wFncOyNgft./FpJDiokauZy/n.N00P.CGDmFjpS6dRBv19Oap5AC',
    'conductor', 7
)
on conflict (email) do nothing;

insert into usuario (nombre, apellido, email, telefono, password_hash, rol, conductor_id)
values (
    'Diego', 'Castillo', 'conductor8@servitransportes.com', '55889900',
    '$2b$10$3wFncOyNgft./FpJDiokauZy/n.N00P.CGDmFjpS6dRBv19Oap5AC',
    'conductor', 8
)
on conflict (email) do nothing;

insert into usuario (nombre, apellido, email, telefono, password_hash, rol, conductor_id)
values (
    'Sofia', 'Ortiz', 'conductor9@servitransportes.com', '55990011',
    '$2b$10$3wFncOyNgft./FpJDiokauZy/n.N00P.CGDmFjpS6dRBv19Oap5AC',
    'conductor', 9
)
on conflict (email) do nothing;

insert into usuario (nombre, apellido, email, telefono, password_hash, rol, conductor_id)
values (
    'Miguel', 'Torres', 'conductor10@servitransportes.com', '56001122',
    '$2b$10$3wFncOyNgft./FpJDiokauZy/n.N00P.CGDmFjpS6dRBv19Oap5AC',
    'conductor', 10
)
on conflict (email) do nothing;
