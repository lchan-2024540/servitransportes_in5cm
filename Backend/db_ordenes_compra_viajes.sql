-- =========================================================
-- script incremental: agrega "orden de compra" (con items en jsonb)
-- y la conecta a factura. no modifica ni elimina ninguna tabla
-- existente (cliente, conductor, vehiculo, ruta, envio, etc.)
-- correr una sola vez, DESPUES de los scripts anteriores.
-- =========================================================

create table if not exists orden_compra (
    id serial primary key,
    cliente_id integer references cliente(id) not null,
    nit varchar(20) not null,
    fecha date default current_date,
    items jsonb not null default '[]',
    total numeric(10,2) not null default 0
);

-- factura ahora se genera a partir de una orden de compra.
-- envio_id se vuelve opcional (una orden puede no atarse a un solo viaje).
alter table factura add column if not exists orden_compra_id integer references orden_compra(id);
alter table factura alter column envio_id drop not null;

create or replace procedure sp_insertar_orden_compra(
    p_cliente_id integer,
    p_nit varchar,
    p_fecha date,
    p_items jsonb,
    p_total numeric
)
language plpgsql
as $$
begin
    insert into orden_compra (cliente_id, nit, fecha, items, total)
    values (p_cliente_id, p_nit, p_fecha, p_items, p_total);
end;
$$;

-- 10 ordenes de compra de ejemplo, una por cliente existente (ids 1 al 10),
-- cada una con 1 o 2 items de materiales/servicios de construccion.
call sp_insertar_orden_compra(1, '1234567-8', '2026-08-01',
    '[{"descripcion_servicio":"Acarreo de piedrin 1ra","cantidad":20,"precio_unitario":175.00,"subtotal":3500.00}]'::jsonb, 3500.00);
call sp_insertar_orden_compra(2, '2345678-9', '2026-08-03',
    '[{"descripcion_servicio":"Acarreo de arena de rio","cantidad":15,"precio_unitario":160.00,"subtotal":2400.00},
      {"descripcion_servicio":"Acarreo de selecto","cantidad":10,"precio_unitario":140.00,"subtotal":1400.00}]'::jsonb, 3800.00);
call sp_insertar_orden_compra(3, '3456789-0', '2026-08-05',
    '[{"descripcion_servicio":"Acarreo de material de banco","cantidad":12,"precio_unitario":150.00,"subtotal":1800.00}]'::jsonb, 1800.00);
call sp_insertar_orden_compra(4, '4567890-1', '2026-08-06',
    '[{"descripcion_servicio":"Acarreo de piedrin triturado","cantidad":25,"precio_unitario":180.00,"subtotal":4500.00},
      {"descripcion_servicio":"Acarreo de cemento a granel","cantidad":5,"precio_unitario":220.00,"subtotal":1100.00}]'::jsonb, 5600.00);
call sp_insertar_orden_compra(5, '5678901-2', '2026-08-07',
    '[{"descripcion_servicio":"Acarreo de arena blanca","cantidad":8,"precio_unitario":165.00,"subtotal":1320.00}]'::jsonb, 1320.00);
call sp_insertar_orden_compra(6, '6789012-3', '2026-08-08',
    '[{"descripcion_servicio":"Acarreo de selecto compactado","cantidad":18,"precio_unitario":170.00,"subtotal":3060.00}]'::jsonb, 3060.00);
call sp_insertar_orden_compra(7, '7890123-4', '2026-08-09',
    '[{"descripcion_servicio":"Acarreo de piedra bola","cantidad":14,"precio_unitario":190.00,"subtotal":2660.00},
      {"descripcion_servicio":"Acarreo de arena de rio","cantidad":6,"precio_unitario":160.00,"subtotal":960.00}]'::jsonb, 3620.00);
call sp_insertar_orden_compra(8, '8901234-5', '2026-08-10',
    '[{"descripcion_servicio":"Acarreo de material selecto","cantidad":16,"precio_unitario":150.00,"subtotal":2400.00}]'::jsonb, 2400.00);
call sp_insertar_orden_compra(9, '9012345-6', '2026-08-11',
    '[{"descripcion_servicio":"Acarreo de piedrin 3/4","cantidad":22,"precio_unitario":178.00,"subtotal":3916.00}]'::jsonb, 3916.00);
call sp_insertar_orden_compra(10, '0123456-7', '2026-08-12',
    '[{"descripcion_servicio":"Acarreo de arena amarilla","cantidad":9,"precio_unitario":168.00,"subtotal":1512.00}]'::jsonb, 1512.00);

-- conecta las 10 facturas que ya existian a su orden de compra correspondiente
-- (asume que la factura 1 corresponde al cliente 1, la 2 al cliente 2, etc.,
-- igual que en Servitransportes_in5cm.sql; ajusta si tu numeracion es distinta)
update factura set orden_compra_id = envio_id where orden_compra_id is null;
