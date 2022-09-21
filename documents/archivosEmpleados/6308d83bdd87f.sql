--DbLolin--
CREATE DATABASE Lolin;
USE lolin;
--Roles--
CREATE TABLE IF NOT EXISTS roles(
	id_rol serial NOT NULL ,
	nombre_rol varchar(100)NOT NULL,
	CONSTRAINT roles_pk PRIMARY KEY (id_rol)
);
--Usuarios--
CREATE TABLE usuarios(
	id_usuario serial NOT NULL ,
	usuario varchar(100) NOT NULL unique,
	contraseña varchar(500) NOT NULL,
	fk_id_rol integer NOT NULL,
	CONSTRAINT usuarios_pk PRIMARY KEY (id_usuario),
	CONSTRAINT usuarios_roles_fk FOREIGN KEY (fk_id_rol) REFERENCES roles(id_rol) ON UPDATE CASCADE ON DELETE CASCADE
);
--Admins--
CREATE TABLE admins(
	id_admin serial NOT null,
	nombre_admin varchar(100) NOT null,
	apellido_admin varchar(100) not null,
	fk_id_usuario int not null,
	constraint admins_pk primary key(id_admin),
	constraint admins_usuarios_fk foreign key (fk_id_usuario) references usuarios (id_usuario) on update cascade on delete cascade
);
--Cliente--
CREATE TABLE clientes(
	id_cliente serial,
	nombre_cliente varchar(100) not null,
	apellido_cliente varchar(100) not null,
	correo_cliente varchar(100) not null unique,
	dui_cliente varchar(10) not null unique,
	telefono_cliente varchar(9) not null unique,
	direccion_cliente varchar(500) not null,
	fk_id_usuario int not null,
	constraint cliente_pk primary key(id_Cliente),
	constraint cliente_usuario_fk foreign key (fk_id_usuario) references usuarios(id_usuario) on update cascade on delete cascade
);
--Tamaños--
create table tamanos(
	id_tamanos serial not null,
	tamano varchar(150) not null unique,
	CONSTRAINT tamanos_pk PRIMARY KEY(id_tamanos)
)
--Estados--
create table estados(
	id_estados serial not null,
	estado varchar(150) not null unique,
	CONSTRAINT estados_pk PRIMARY KEY(id_estados)
)
--Pedidos Personalizados
CREATE TABLE pedidos_personalizados(
	id_pedidos_personalizado serial NOT NULL,
	fecha_pedidopersonal date NOT NULL,
	imagenejemplo_pedidopersonal varchar(500) NOT NULL,
	descripcionlugar_entrega varchar(500)NOT NULL,
	fk_id_cliente integer NOT NULL,
	fk_id_tamano integer NOT NULL,
	fk_id_estado integer NOT NULL,
	CONSTRAINT pedidos_personalizados_pk PRIMARY KEY (id_pedidos_personalizado),
	CONSTRAINT pedidos_personalizados_clientes_fk FOREIGN KEY (fk_id_cliente) REFERENCES clientes(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT pedidos_personalizados_tamanos_fk FOREIGN KEY (fk_id_tamano) REFERENCES tamanos(id_tamanos) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT pedidos_personalizados_estados_fk FOREIGN KEY (fk_id_estado) REFERENCES estados(id_estados) ON UPDATE CASCADE ON DELETE CASCADE
)
--Pedidos Establecidos
create table pedidos_establecidos(
	id_pedidos_establecidos serial not null,
	fecha_pedidoesta date not null,
	descripcionlugar_entrega varchar(500) not null,
	montototal_pepidoesta numeric(6,2) not null,
	fk_id_cliente int not null,
	fk_id_estado int not null,
	constraint pedidosesta_pk primary key (id_pedidos_establecidos),
	constraint pedidosesta_clientes_fk foreign key (fk_id_cliente) references clientes(id_cliente) on update cascade on delete cascade,
	constraint pedidosesta_estados_fk foreign key (fk_id_estado) references estados(id_estados) on update cascade on delete cascade
);
--Categorias--
create table categorias(
	id_categoria serial NOT NULL,
	nombre_categoria varchar(100) not null unique,
	CONSTRAINT categorias_pk PRIMARY KEY (id_categoria)
)
--Valoracion--
create table valoraciones(
	id_valoraciones serial NOT NULL,
	valoraciones varchar(50) not null unique,
	CONSTRAINT valoraciones_pk PRIMARY KEY (id_valoraciones)
)
--Productos--
CREATE table productos(
	id_producto serial NOT NULL,
	nombre_producto varchar(150)  NOT NULL unique,
	imagen_producto varchar(500)  NOT NULL,
	precio_producto numeric(6,2) NOT NULL,
	cantidad integer NOT NULL,
	fk_id_estado integer NOT NULL,
	fk_id_categoria integer NOT NULL,
	fk_id_valoraciones integer NOT NULL,
	CONSTRAINT productos_pk PRIMARY KEY (id_producto),
	CONSTRAINT productos_estados_fk FOREIGN KEY (fk_id_estado) REFERENCES estados(id_estados) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT productos_categorias_fk FOREIGN KEY (fk_id_categoria) REFERENCES categorias(id_categoria) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT productos_valoraciones_fk FOREIGN KEY (fk_id_valoraciones) REFERENCES valoraciones(id_valoraciones) ON UPDATE CASCADE ON DELETE CASCADE
)
--Detalle Pedido Establecido--
create table detallepedidos_establecidos(
	id_detalle_pedidos serial not null,
	cantidad_detallep int not null,
	subtotal_detallep numeric(6,2) not null,
	fk_id_producto int not null,
	fk_id_tamano int not null,
	fk_id_pedidos_establecidos int not null,
	constraint detallepedidos_pk primary key (id_detalle_pedidos),
	constraint detallepedidos_productos_fk foreign key (fk_id_producto) references productos(id_producto) on update cascade on delete cascade,
	constraint detallepedidos_tamano_fk foreign key (fk_id_tamano) references tamanos(id_tamanos) on update cascade on delete cascade,
	constraint detallepedidos_pedidosesta_fk foreign key (fk_id_pedidos_establecidos) references pedidos_establecidos(id_pedidos_establecidos) on update cascade on delete cascade
);
--Valoraciones Clientes--
CREATE TABLE valoraciones_clientes(
	id_valoracionescli serial NOT NULL,
	fk_id_cliente integer NOT NULL,
	fk_id_productos integer NOT NULL,
	fk_id_valoraciones integer NOT NULL,
	CONSTRAINT valoraciones_clientes_pk PRIMARY KEY (id_valoracionescli),
	CONSTRAINT valoraciones_clientes_cliente_fk FOREIGN KEY (fk_id_cliente) REFERENCES clientes(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT valoraciones_clientes_productos_fk FOREIGN KEY (fk_id_productos) REFERENCES productos(id_producto) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT valoraciones_clientes_valoraciones_fk FOREIGN KEY (fk_id_valoraciones) REFERENCES valoraciones(id_valoraciones) ON UPDATE CASCADE ON DELETE CASCADE
)
--Comentarios--
CREATE TABLE comentarios(
	id_comentarios integer NOT NULL,
	comentario varchar(500) NOT NULL,
	fk_id_cliente integer NOT NULL ,
	fk_id_productos integer NOT NULL,
	CONSTRAINT pk_comentarios PRIMARY KEY (id_comentarios),
	CONSTRAINT comentarios_cliente_fk FOREIGN KEY (fk_id_cliente) REFERENCES clientes(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT comentarios_productos_fk FOREIGN KEY (fk_id_productos) REFERENCES productos(id_producto) ON UPDATE CASCADE ON DELETE CASCADE
)
--Fin por el momento--
