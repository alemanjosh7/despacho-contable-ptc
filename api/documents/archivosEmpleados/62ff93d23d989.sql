--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1

-- Started on 2022-05-13 17:01:53

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 240 (class 1255 OID 27353)
-- Name: actualizarcantidadprdi(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.actualizarcantidadprdi() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
--Declaramos las variables
idmax int:=(SELECT MAX(id_inventario) FROM inventario);
idprd int:=(SELECT fk_id_producto FROM inventario 
			   WHERE id_inventario=idmax);
cantprd int:=(SELECT cantidadn FROM inventario 
		  WHERE id_inventario = idmax);
BEGIN
--Indicamos el procedimiento a realizar
UPDATE productos SET cantidad=cantidad+cantprd 
WHERE id_producto=idprd;
RETURN NEW;
END
$$;


ALTER FUNCTION public.actualizarcantidadprdi() OWNER TO postgres;

--
-- TOC entry 245 (class 1255 OID 18480)
-- Name: actualizarcantidadprodct(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.actualizarcantidadprodct() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
--Declaramos las variables
idmax int:=(SELECT MAX(id_detalle_pedidos) FROM detallepedidos_establecidos);
ctr int:=(SELECT cantidad_detallep FROM detallepedidos_establecidos 
		  WHERE id_detalle_pedidos=idmax);
idprd int:=(SELECT fk_id_producto FROM detallepedidos_establecidos 
			   WHERE id_detalle_pedidos=idmax);
BEGIN
--Indicamos el procedimiento a realizar
UPDATE productos SET cantidad=cantidad-ctr WHERE id_producto=idprd;
RETURN NEW;
END
$$;


ALTER FUNCTION public.actualizarcantidadprodct() OWNER TO postgres;

--
-- TOC entry 244 (class 1255 OID 18454)
-- Name: actualizarmontopedido(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.actualizarmontopedido() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
--Declaramos las variables
idmax int:=(SELECT MAX(id_detalle_pedidos) FROM detallepedidos_establecidos);
idpedido int:=(SELECT fk_id_pedidos_establecidos FROM detallepedidos_establecidos 
			   WHERE id_detalle_pedidos=idmax);
preciot numeric(6,2):=(SELECT SUM(subtotal_detallep) FROM detallepedidos_establecidos
					  WHERE fk_id_pedidos_establecidos=idpedido);
BEGIN
--Indicamos el procedimiento a realizar
UPDATE pedidos_establecidos SET montototal_pedidoesta=preciot 
WHERE id_pedidos_establecidos=idpedido;
RETURN NEW;
END
$$;


ALTER FUNCTION public.actualizarmontopedido() OWNER TO postgres;

--
-- TOC entry 262 (class 1255 OID 35498)
-- Name: actualizarsubtotal(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.actualizarsubtotal() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
--Declaramos las variables
idmax int:=(SELECT MAX(id_detalle_pedidos) FROM detallepedidos_establecidos);
cant int:=(SELECT cantidad_detallep FROM detallepedidos_establecidos 
			   WHERE id_detalle_pedidos=idmax);
idprd int:= (SELECT fk_id_producto FROM detallepedidos_establecidos WHERE id_detalle_pedidos=idmax);
preciop numeric(6,2):=(SELECT precio_producto FROM productos
					  WHERE id_producto=idprd);
BEGIN
--Indicamos el procedimiento a realizar
UPDATE detallepedidos_establecidos SET subtotal_detallep=cant*preciop 
WHERE detallepedidos_establecidos=idmax;
RETURN NEW;
END
$$;


ALTER FUNCTION public.actualizarsubtotal() OWNER TO postgres;

--
-- TOC entry 259 (class 1255 OID 18556)
-- Name: actualizarvaloracion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.actualizarvaloracion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
--Declaramos las variables
idmax int:=(select max(id_valoracionescli)from valoraciones_clientes);
idpt int:=(select fk_id_productos from valoraciones_clientes where id_valoracionescli=idmax);
idv1 int:=(select count(fk_id_valoraciones) as total from valoraciones_clientes 
		   where fk_id_productos = idpt and fk_id_valoraciones =1);
idv2 int:=(select count(fk_id_valoraciones) as total from valoraciones_clientes 
		   where fk_id_productos = idpt and fk_id_valoraciones =2);
idv3 int:=(select count(fk_id_valoraciones) as total from valoraciones_clientes 
		   where fk_id_productos = idpt and fk_id_valoraciones =3);
idv4 int:=(select count(fk_id_valoraciones) as total from valoraciones_clientes 
		   where fk_id_productos = idpt and fk_id_valoraciones =4);
idv5 int:=(select count(fk_id_valoraciones) as total from valoraciones_clientes 
		   where fk_id_productos = idpt and fk_id_valoraciones =5);
idv int:=3;
BEGIN
--Indicamos el procedimiento a realizar
case --Colocamos el valor en  cada caso
when (idv1>idv2 and idv1>idv3 and idv1>idv4 and idv1>idv5) then
	idv=1;
when (idv2>idv1 and idv2>idv3 and idv2>idv4 and idv2>idv5) then
	idv=2;
when (idv3>idv2 and idv3>idv1 and idv3>idv4 and idv3>idv5) then
	idv=3;
when (idv4>idv2 and idv4>idv3 and idv4>idv1 and idv4>idv5) then
	idv=4;
when (idv5>idv2 and idv5>idv3 and idv5>idv4 and idv5>idv1) then
	idv=5;
end case;
UPDATE productos SET fk_id_valoraciones=idv WHERE id_producto=idpt;
RETURN NEW;
END
$$;


ALTER FUNCTION public.actualizarvaloracion() OWNER TO postgres;

--
-- TOC entry 238 (class 1255 OID 18826)
-- Name: insertaradministrador(character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.insertaradministrador(nombre_a character varying, apellido_a character varying, usuario_a character varying, contra character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
INSERT INTO admins VALUES (default, nombre_a, apellido_a, usuario_a, contra);
END
$$;


ALTER FUNCTION public.insertaradministrador(nombre_a character varying, apellido_a character varying, usuario_a character varying, contra character varying) OWNER TO postgres;

--
-- TOC entry 237 (class 1255 OID 18825)
-- Name: insertarproducto(character varying, character varying, numeric, integer, integer, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.insertarproducto(nombre_p character varying, imagen_p character varying, precio_p numeric, cantidad_p integer, categoria_p integer, valoraciones_p integer, id_admin_p integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
INSERT INTO productos VALUES (default, nombre_p, imagen_p, precio_p, cantidad_p, categoria_p, valoraciones_p, id_admin_p);
END
$$;


ALTER FUNCTION public.insertarproducto(nombre_p character varying, imagen_p character varying, precio_p numeric, cantidad_p integer, categoria_p integer, valoraciones_p integer, id_admin_p integer) OWNER TO postgres;

--
-- TOC entry 257 (class 1255 OID 18850)
-- Name: minimovaloracionproducto(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.minimovaloracionproducto(producto character varying) RETURNS TABLE("Valoracion" integer, "nombre del producto" character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
BEGIN
--Retornamos el select
RETURN QUERY Select MIN(vcl.fk_id_valoraciones),pct.nombre_producto from valoraciones_clientes as vcl,
productos as pct where vcl.fk_id_productos=pct.id_producto and pct.nombre_producto=producto
group by pct.nombre_producto;
END
$$;


ALTER FUNCTION public.minimovaloracionproducto(producto character varying) OWNER TO postgres;

--
-- TOC entry 236 (class 1255 OID 18824)
-- Name: obteneridempleado(character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.obteneridempleado(usu character varying, contra character varying) RETURNS TABLE(id integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
BEGIN
RETURN QUERY SELECT ad.id_admin FROM admins as ad
where ad.usuario = usu and ad.contrasena = contra;
END
$$;


ALTER FUNCTION public.obteneridempleado(usu character varying, contra character varying) OWNER TO postgres;

--
-- TOC entry 239 (class 1255 OID 18827)
-- Name: obtenerproductoscategoria(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.obtenerproductoscategoria(categ character varying) RETURNS TABLE(id integer, "nombre del producto" character varying, "imagen del producto" character varying, "precio del producto" numeric, cantidad integer, valoraciones integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
BEGIN
RETURN QUERY SELECT p.id_producto, p.nombre_producto, p.imagen_producto, p.precio_producto, 
p.cantidad, p.fk_id_valoraciones FROM productos as p INNER JOIN categorias AS cate ON 
cate.nombre_categoria = categ and cate.id_categoria = p.fk_id_categoria;
END
$$;


ALTER FUNCTION public.obtenerproductoscategoria(categ character varying) OWNER TO postgres;

--
-- TOC entry 256 (class 1255 OID 18849)
-- Name: obtenerproductosxcategoria(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.obtenerproductosxcategoria(categoria character varying) RETURNS TABLE(producto character varying, "nombre de categoria" character varying, "id de categoria" integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
BEGIN
--Retornamos el select
RETURN QUERY SELECT pt.nombre_producto,	cat.nombre_categoria,cat.id_categoria FROM productos as pt, 
categorias as cat WHERE cat.nombre_categoria=categoria and pt.fk_id_categoria=cat.id_categoria 
ORDER BY nombre_categoria;
END
$$;


ALTER FUNCTION public.obtenerproductosxcategoria(categoria character varying) OWNER TO postgres;

--
-- TOC entry 260 (class 1255 OID 18571)
-- Name: pedidosantesde(date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.pedidosantesde(fecha date) RETURNS TABLE(id integer, "fecha del pedido" date, descripcion character varying, "monto total" numeric, cliente record, estado character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
BEGIN
--Retornamos el select
RETURN QUERY SELECT pes.id_pedidos_establecidos, pes.fecha_pedidoesta, pes.descripcionlugar_entrega,
pes.montototal_pedidoesta,(clt.nombre_cliente,clt.apellido_cliente) as cliente,
est.estado FROM pedidos_establecidos as pes
INNER JOIN clientes AS clt ON pes.fk_id_cliente = clt.id_cliente
INNER JOIN estados AS est ON pes.fk_id_estado = est.id_estados 
WHERE pes.fecha_pedidoesta<=fecha 
order by pes.fecha_pedidoesta desc;
END
$$;


ALTER FUNCTION public.pedidosantesde(fecha date) OWNER TO postgres;

--
-- TOC entry 261 (class 1255 OID 18573)
-- Name: pedidosentrefechas(date, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.pedidosentrefechas(fechai date, fechaf date) RETURNS TABLE(id integer, "fecha del pedido" date, descripcion character varying, "monto total" numeric, cliente record, estado character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
BEGIN
--Retornamos el select
RETURN QUERY SELECT pes.id_pedidos_establecidos, pes.fecha_pedidoesta, pes.descripcionlugar_entrega,
pes.montototal_pedidoesta,(clt.nombre_cliente,clt.apellido_cliente) as cliente,
est.estado FROM pedidos_establecidos as pes
INNER JOIN clientes AS clt ON pes.fk_id_cliente = clt.id_cliente
INNER JOIN estados AS est ON pes.fk_id_estado = est.id_estados 
WHERE pes.fecha_pedidoesta>=fechai AND pes.fecha_pedidoesta<=fechaf 
order by pes.fecha_pedidoesta desc;
END
$$;


ALTER FUNCTION public.pedidosentrefechas(fechai date, fechaf date) OWNER TO postgres;

--
-- TOC entry 258 (class 1255 OID 18851)
-- Name: pedidosperentrefechas(date, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.pedidosperentrefechas(fechai date, fechaf date) RETURNS TABLE(id integer, "fecha del pedido" date, descripcion character varying, "imagen de ejemplo" character varying, "descripcion lugar entrega" character varying, cliente record, tamano character varying, estado character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
BEGIN
--Retornamos el select
RETURN QUERY SELECT pes.id_pedidos_personalizado, pes.fecha_pedidopersonal, 
pes.descripcion_pedidopersonal,pes.imagenejemplo_pedidopersonal,
pes.descripcionlugar_entrega,(clt.nombre_cliente,clt.apellido_cliente) as cliente,
tmn.tamano,est.estado FROM pedidos_personalizados as pes
INNER JOIN clientes AS clt ON pes.fk_id_cliente = clt.id_cliente
INNER JOIN tamanos as tmn ON pes.fk_id_tamano = tmn.id_tamanos
INNER JOIN estados AS est ON pes.fk_id_estado = est.id_estados 
WHERE pes.fecha_pedidopersonal>=fechai AND pes.fecha_pedidopersonal<=fechaf
order by pes.fecha_pedidopersonal desc;
END
$$;


ALTER FUNCTION public.pedidosperentrefechas(fechai date, fechaf date) OWNER TO postgres;

--
-- TOC entry 254 (class 1255 OID 18847)
-- Name: productosregadmin(character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.productosregadmin(nombre character varying, apellido character varying) RETURNS TABLE(producto character varying, cantidad integer, "precio del producto" numeric, "imagen del producto" character varying, "nombre administrador" character varying, "apellido administrador" character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
BEGIN
--Retornamos el select
RETURN QUERY select tp.nombre_producto, tp.cantidad, tp.precio_producto, tp.imagen_producto, ta.nombre_admin, 
ta.apellido_admin from productos tp, admins ta where tp.fk_id_admin = ta.id_admin
and nombre_admin=nombre and apellido_admin=apellido;
END
$$;


ALTER FUNCTION public.productosregadmin(nombre character varying, apellido character varying) OWNER TO postgres;

--
-- TOC entry 255 (class 1255 OID 18848)
-- Name: rangoprecioproducto(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.rangoprecioproducto(precioi integer, preciof integer) RETURNS TABLE(producto character varying, "precio del producto" numeric)
    LANGUAGE plpgsql
    AS $$
DECLARE
BEGIN
--Retornamos el select
RETURN QUERY SELECT nombre_producto,	precio_producto FROM productos WHERE precio_producto >=precioi 
AND precio_producto<=preciof ORDER BY precio_producto DESC;
END
$$;


ALTER FUNCTION public.rangoprecioproducto(precioi integer, preciof integer) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 18124)
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id_admin integer NOT NULL,
    nombre_admin character varying(100) NOT NULL,
    apellido_admin character varying(100) NOT NULL,
    usuario character varying(100) NOT NULL,
    contrasena character varying(500) NOT NULL,
    fk_id_estado integer DEFAULT 8
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 18123)
-- Name: admins_id_admin_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_id_admin_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.admins_id_admin_seq OWNER TO postgres;

--
-- TOC entry 3499 (class 0 OID 0)
-- Dependencies: 209
-- Name: admins_id_admin_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_id_admin_seq OWNED BY public.admins.id_admin;


--
-- TOC entry 220 (class 1259 OID 18213)
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id_categoria integer NOT NULL,
    nombre_categoria character varying(100) NOT NULL
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 18212)
-- Name: categorias_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categorias_id_categoria_seq OWNER TO postgres;

--
-- TOC entry 3500 (class 0 OID 0)
-- Dependencies: 219
-- Name: categorias_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_id_categoria_seq OWNED BY public.categorias.id_categoria;


--
-- TOC entry 212 (class 1259 OID 18135)
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id_cliente integer NOT NULL,
    nombre_cliente character varying(100) NOT NULL,
    apellido_cliente character varying(100) NOT NULL,
    correo_cliente character varying(100) NOT NULL,
    dui_cliente character varying(10) NOT NULL,
    telefono_cliente character varying(9) NOT NULL,
    direccion_cliente character varying(500) NOT NULL,
    usuario character varying(100) NOT NULL,
    contrasena character varying(500) NOT NULL,
    fk_id_estado integer DEFAULT 8
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 18134)
-- Name: clientes_id_cliente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clientes_id_cliente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.clientes_id_cliente_seq OWNER TO postgres;

--
-- TOC entry 3501 (class 0 OID 0)
-- Dependencies: 211
-- Name: clientes_id_cliente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clientes_id_cliente_seq OWNED BY public.clientes.id_cliente;


--
-- TOC entry 224 (class 1259 OID 18231)
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos (
    id_producto integer NOT NULL,
    nombre_producto character varying(150) NOT NULL,
    imagen_producto character varying(500) NOT NULL,
    precio_producto numeric(6,2) NOT NULL,
    cantidad integer NOT NULL,
    fk_id_categoria integer NOT NULL,
    fk_id_valoraciones integer NOT NULL,
    fk_id_admin integer NOT NULL,
    descripcion character varying(150)
);


ALTER TABLE public.productos OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 18828)
-- Name: detalle_productos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.detalle_productos AS
 SELECT tp.nombre_producto,
    tp.precio_producto,
    tc.id_categoria
   FROM public.productos tp,
    public.categorias tc
  WHERE (tp.fk_id_categoria = tc.id_categoria);


ALTER TABLE public.detalle_productos OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 18257)
-- Name: detallepedidos_establecidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detallepedidos_establecidos (
    id_detalle_pedidos integer NOT NULL,
    cantidad_detallep integer NOT NULL,
    subtotal_detallep numeric(6,2) NOT NULL,
    fk_id_producto integer NOT NULL,
    fk_id_pedidos_establecidos integer NOT NULL
);


ALTER TABLE public.detallepedidos_establecidos OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 18256)
-- Name: detallepedidos_establecidos_id_detalle_pedidos_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detallepedidos_establecidos_id_detalle_pedidos_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.detallepedidos_establecidos_id_detalle_pedidos_seq OWNER TO postgres;

--
-- TOC entry 3502 (class 0 OID 0)
-- Dependencies: 225
-- Name: detallepedidos_establecidos_id_detalle_pedidos_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detallepedidos_establecidos_id_detalle_pedidos_seq OWNED BY public.detallepedidos_establecidos.id_detalle_pedidos;


--
-- TOC entry 216 (class 1259 OID 18161)
-- Name: estados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estados (
    id_estados integer NOT NULL,
    estado character varying(150) NOT NULL
);


ALTER TABLE public.estados OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 18160)
-- Name: estados_id_estados_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estados_id_estados_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.estados_id_estados_seq OWNER TO postgres;

--
-- TOC entry 3503 (class 0 OID 0)
-- Dependencies: 215
-- Name: estados_id_estados_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estados_id_estados_seq OWNED BY public.estados.id_estados;


--
-- TOC entry 235 (class 1259 OID 27336)
-- Name: inventario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventario (
    id_inventario integer NOT NULL,
    cantidada integer NOT NULL,
    cantidadn integer NOT NULL,
    modificado boolean NOT NULL,
    fecha date DEFAULT CURRENT_DATE,
    fk_id_admin integer NOT NULL,
    fk_id_producto integer NOT NULL
);


ALTER TABLE public.inventario OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 27335)
-- Name: inventario_id_inventario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventario_id_inventario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inventario_id_inventario_seq OWNER TO postgres;

--
-- TOC entry 3504 (class 0 OID 0)
-- Dependencies: 234
-- Name: inventario_id_inventario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventario_id_inventario_seq OWNED BY public.inventario.id_inventario;


--
-- TOC entry 218 (class 1259 OID 18194)
-- Name: pedidos_establecidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedidos_establecidos (
    id_pedidos_establecidos integer NOT NULL,
    fecha_pedidoesta date NOT NULL,
    descripcionlugar_entrega character varying(500) NOT NULL,
    montototal_pedidoesta numeric(6,2) NOT NULL,
    fk_id_cliente integer NOT NULL,
    fk_id_estado integer NOT NULL
);


ALTER TABLE public.pedidos_establecidos OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 18193)
-- Name: pedidos_establecidos_id_pedidos_establecidos_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedidos_establecidos_id_pedidos_establecidos_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pedidos_establecidos_id_pedidos_establecidos_seq OWNER TO postgres;

--
-- TOC entry 3505 (class 0 OID 0)
-- Dependencies: 217
-- Name: pedidos_establecidos_id_pedidos_establecidos_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedidos_establecidos_id_pedidos_establecidos_seq OWNED BY public.pedidos_establecidos.id_pedidos_establecidos;


--
-- TOC entry 230 (class 1259 OID 18575)
-- Name: pedidos_personalizados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedidos_personalizados (
    id_pedidos_personalizado integer NOT NULL,
    fecha_pedidopersonal date NOT NULL,
    descripcion_pedidopersonal character varying(500) NOT NULL,
    imagenejemplo_pedidopersonal character varying(500) NOT NULL,
    descripcionlugar_entrega character varying(500) NOT NULL,
    fk_id_cliente integer NOT NULL,
    fk_id_tamano integer NOT NULL,
    fk_id_estado integer NOT NULL
);


ALTER TABLE public.pedidos_personalizados OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 18574)
-- Name: pedidos_personalizados_id_pedidos_personalizado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedidos_personalizados_id_pedidos_personalizado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pedidos_personalizados_id_pedidos_personalizado_seq OWNER TO postgres;

--
-- TOC entry 3506 (class 0 OID 0)
-- Dependencies: 229
-- Name: pedidos_personalizados_id_pedidos_personalizado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedidos_personalizados_id_pedidos_personalizado_seq OWNED BY public.pedidos_personalizados.id_pedidos_personalizado;


--
-- TOC entry 232 (class 1259 OID 18832)
-- Name: producto_admi; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.producto_admi AS
 SELECT tp.nombre_producto,
    ta.nombre_admin,
    ta.id_admin
   FROM public.productos tp,
    public.admins ta
  WHERE (tp.fk_id_admin = ta.id_admin);


ALTER TABLE public.producto_admi OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 18230)
-- Name: productos_id_producto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_id_producto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.productos_id_producto_seq OWNER TO postgres;

--
-- TOC entry 3507 (class 0 OID 0)
-- Dependencies: 223
-- Name: productos_id_producto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_id_producto_seq OWNED BY public.productos.id_producto;


--
-- TOC entry 214 (class 1259 OID 18152)
-- Name: tamanos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tamanos (
    id_tamanos integer NOT NULL,
    tamano character varying(150) NOT NULL
);


ALTER TABLE public.tamanos OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 18151)
-- Name: tamanos_id_tamanos_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tamanos_id_tamanos_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tamanos_id_tamanos_seq OWNER TO postgres;

--
-- TOC entry 3508 (class 0 OID 0)
-- Dependencies: 213
-- Name: tamanos_id_tamanos_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tamanos_id_tamanos_seq OWNED BY public.tamanos.id_tamanos;


--
-- TOC entry 233 (class 1259 OID 18840)
-- Name: total_produc; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.total_produc AS
 SELECT tp.nombre_producto,
    tp.precio_producto,
    td.cantidad_detallep,
    td.id_detalle_pedidos
   FROM public.productos tp,
    public.detallepedidos_establecidos td
  WHERE (td.fk_id_producto = tp.id_producto);


ALTER TABLE public.total_produc OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 18222)
-- Name: valoraciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.valoraciones (
    id_valoraciones integer NOT NULL,
    valoraciones integer NOT NULL
);


ALTER TABLE public.valoraciones OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 18529)
-- Name: valoraciones_clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.valoraciones_clientes (
    id_valoracionescli integer NOT NULL,
    comentario character varying(500) NOT NULL,
    fk_id_cliente integer NOT NULL,
    fk_id_productos integer NOT NULL,
    fk_id_valoraciones integer NOT NULL
);


ALTER TABLE public.valoraciones_clientes OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 18528)
-- Name: valoraciones_clientes_id_valoracionescli_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.valoraciones_clientes_id_valoracionescli_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.valoraciones_clientes_id_valoracionescli_seq OWNER TO postgres;

--
-- TOC entry 3509 (class 0 OID 0)
-- Dependencies: 227
-- Name: valoraciones_clientes_id_valoracionescli_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.valoraciones_clientes_id_valoracionescli_seq OWNED BY public.valoraciones_clientes.id_valoracionescli;


--
-- TOC entry 221 (class 1259 OID 18221)
-- Name: valoraciones_id_valoraciones_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.valoraciones_id_valoraciones_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.valoraciones_id_valoraciones_seq OWNER TO postgres;

--
-- TOC entry 3510 (class 0 OID 0)
-- Dependencies: 221
-- Name: valoraciones_id_valoraciones_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.valoraciones_id_valoraciones_seq OWNED BY public.valoraciones.id_valoraciones;


--
-- TOC entry 3247 (class 2604 OID 18127)
-- Name: admins id_admin; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN id_admin SET DEFAULT nextval('public.admins_id_admin_seq'::regclass);


--
-- TOC entry 3254 (class 2604 OID 18216)
-- Name: categorias id_categoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id_categoria SET DEFAULT nextval('public.categorias_id_categoria_seq'::regclass);


--
-- TOC entry 3249 (class 2604 OID 18138)
-- Name: clientes id_cliente; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id_cliente SET DEFAULT nextval('public.clientes_id_cliente_seq'::regclass);


--
-- TOC entry 3257 (class 2604 OID 18260)
-- Name: detallepedidos_establecidos id_detalle_pedidos; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallepedidos_establecidos ALTER COLUMN id_detalle_pedidos SET DEFAULT nextval('public.detallepedidos_establecidos_id_detalle_pedidos_seq'::regclass);


--
-- TOC entry 3252 (class 2604 OID 18164)
-- Name: estados id_estados; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados ALTER COLUMN id_estados SET DEFAULT nextval('public.estados_id_estados_seq'::regclass);


--
-- TOC entry 3260 (class 2604 OID 27339)
-- Name: inventario id_inventario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario ALTER COLUMN id_inventario SET DEFAULT nextval('public.inventario_id_inventario_seq'::regclass);


--
-- TOC entry 3253 (class 2604 OID 18197)
-- Name: pedidos_establecidos id_pedidos_establecidos; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos_establecidos ALTER COLUMN id_pedidos_establecidos SET DEFAULT nextval('public.pedidos_establecidos_id_pedidos_establecidos_seq'::regclass);


--
-- TOC entry 3259 (class 2604 OID 18578)
-- Name: pedidos_personalizados id_pedidos_personalizado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos_personalizados ALTER COLUMN id_pedidos_personalizado SET DEFAULT nextval('public.pedidos_personalizados_id_pedidos_personalizado_seq'::regclass);


--
-- TOC entry 3256 (class 2604 OID 18234)
-- Name: productos id_producto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos ALTER COLUMN id_producto SET DEFAULT nextval('public.productos_id_producto_seq'::regclass);


--
-- TOC entry 3251 (class 2604 OID 18155)
-- Name: tamanos id_tamanos; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tamanos ALTER COLUMN id_tamanos SET DEFAULT nextval('public.tamanos_id_tamanos_seq'::regclass);


--
-- TOC entry 3255 (class 2604 OID 18225)
-- Name: valoraciones id_valoraciones; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valoraciones ALTER COLUMN id_valoraciones SET DEFAULT nextval('public.valoraciones_id_valoraciones_seq'::regclass);


--
-- TOC entry 3258 (class 2604 OID 18532)
-- Name: valoraciones_clientes id_valoracionescli; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valoraciones_clientes ALTER COLUMN id_valoracionescli SET DEFAULT nextval('public.valoraciones_clientes_id_valoracionescli_seq'::regclass);


--
-- TOC entry 3471 (class 0 OID 18124)
-- Dependencies: 210
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id_admin, nombre_admin, apellido_admin, usuario, contrasena, fk_id_estado) FROM stdin;
2	Josue	Aleman	AlemanJos	Aleman2246	8
3	Isabel	Martinez	IsabelM	IsabeJM	8
4	Jonathan	Grande	JonthanR	Grande46	8
5	Heber	Cornejo	CornejoHb	Heber2791	8
1	Jesús	Esquivel	JesusEs	$2y$10$zX1R9Myjv.FXPcn3/EProuEUASmwUEkWlBH2eORwqanWCTpIgulsa	8
6	Gerardo	Martinez	GMartinez	123GMA	8
\.


--
-- TOC entry 3481 (class 0 OID 18213)
-- Dependencies: 220
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias (id_categoria, nombre_categoria) FROM stdin;
1	Animales
3	Caricatura
4	Videojuegos
5	Plantas
6	Accesorio para humano
7	Anime
8	Decoración de oficina
9	Florales
10	Película
2	Personajes
11	Artista
\.


--
-- TOC entry 3473 (class 0 OID 18135)
-- Dependencies: 212
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clientes (id_cliente, nombre_cliente, apellido_cliente, correo_cliente, dui_cliente, telefono_cliente, direccion_cliente, usuario, contrasena, fk_id_estado) FROM stdin;
2	Sara	Pinar	Valentina.Ros37@gmail.com	98373359-3	7087-2455	Avenida	Valentina	$2y$10$qEu4U7x.InYRARey/6ZVFOX0nBtapIzvV0cykmK0FoeUNr5isU8Ry	8
3	Martín	Acosta	Óscar.Ren34@gmail.com	98072540-5	6078-2340	AVENIDA \nNIÑOS HEROES NO. 3	Óscar.Ren34	805235	8
4	Gabriela	Torre	Sara.Pin96@gmail.com	09287455-4	6976-3094	CARRETERA \nMEXICO-LAREDO KM.125	Sara.Pin96	101345	8
5	Matías	Rincón	Efraín.Mej52@gmail.com	10946555-8	7623-9054	PLAZA \nCONSTITUCION NO. 1	Efraín.Mej52	398360	8
6	Manuela	Hincapié	Julieta.Leó07@gmail.com	67685809-9	7726-0832	DOMICILIO CONOCIDO	Julieta.Leó07	087345	8
7	Sebastián	Yepes	Martín.Aco68@gmail.com	08207945-7	7234-5999	CARRETERA MEXICO-LAREDO	Martín.Aco68	089367	8
8	Sofía	Arango	Gabriela.Tor11@gmail.com	90827633-3	7980-2387	AVENIDA \nMIGUEL HIDALGO S/N	Gabriela.Tor11	098734	8
9	Ana	Peña	Matías.Rin93@gmail.com	98745067-1	7107-2044	CARRETERA SAN \nSALVADOR SAN MIGUEL K	Matías.Rin93	309i94	8
1	Carlos	Herrera	CarlosFfu@gmail.com	09452339-3	7327-7323	DOMICILIO \r\nCONOCIDO	Fuentesc82	876120	8
10	Mónica	Mendoza	ManuelaHin07@gmail.com	97605629-9	6657-3924	avenida	Manuela	$2y$10$AF3WLzTul0IJltiIrllam.iX2K8OoEmW344w.hQcFKwZDBd0Y.GwC	9
\.


--
-- TOC entry 3487 (class 0 OID 18257)
-- Dependencies: 226
-- Data for Name: detallepedidos_establecidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detallepedidos_establecidos (id_detalle_pedidos, cantidad_detallep, subtotal_detallep, fk_id_producto, fk_id_pedidos_establecidos) FROM stdin;
1	1	8.44	1	1
2	2	8.43	2	1
3	3	8.43	3	1
4	4	8.10	4	2
5	5	8.10	5	2
6	6	8.10	6	2
7	7	7.78	7	3
8	8	7.76	8	3
9	9	7.76	9	3
10	10	7.44	10	4
11	11	7.43	1	4
12	12	7.43	2	4
13	13	7.10	3	5
14	14	7.10	4	5
15	15	7.10	5	5
16	16	6.84	6	6
17	17	6.83	7	6
18	18	6.83	8	6
19	19	6.43	9	7
20	20	6.41	10	7
21	21	6.41	1	7
22	22	6.18	2	8
23	23	6.16	3	8
24	24	6.16	4	8
25	25	5.00	5	9
26	26	5.00	6	9
27	27	5.00	7	9
28	28	3.39	8	10
31	1	25.00	1	10
33	1	25.00	1	10
\.


--
-- TOC entry 3477 (class 0 OID 18161)
-- Dependencies: 216
-- Data for Name: estados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estados (id_estados, estado) FROM stdin;
1	Pendiente
2	Enviado
3	Agotado
4	Disponible
5	Negado
6	Aceptado
7	Comprando
8	Activo
9	Bloqueado
10	Eliminado
\.


--
-- TOC entry 3493 (class 0 OID 27336)
-- Dependencies: 235
-- Data for Name: inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventario (id_inventario, cantidada, cantidadn, modificado, fecha, fk_id_admin, fk_id_producto) FROM stdin;
1	34	1	f	2022-04-29	1	1
2	35	5	f	2022-04-29	1	1
3	19	1	f	2022-04-29	1	9
4	20	2	t	2022-04-29	1	9
5	40	5	t	2022-04-30	1	1
\.


--
-- TOC entry 3479 (class 0 OID 18194)
-- Dependencies: 218
-- Data for Name: pedidos_establecidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pedidos_establecidos (id_pedidos_establecidos, fecha_pedidoesta, descripcionlugar_entrega, montototal_pedidoesta, fk_id_cliente, fk_id_estado) FROM stdin;
2	2022-03-02	Tercer Parqueo, calle principal frente a unas champas	24.30	2	1
3	2022-03-01	Tercer Parqueo, calle principal frente a unas champas	23.30	3	1
4	2022-02-28	Segundo Parqueo, calle principal frente a unas champas	22.30	4	1
5	2022-02-27	Segundo Parqueo, calle principal frente a unas champas	21.30	5	1
6	2022-02-26	Segundo Parqueo, calle principal frente a unas champas	20.50	6	1
7	2022-02-25	Primer Parqueo, calle principal frente a unas champas	19.25	7	1
8	2022-02-24	Primer Parqueo, calle principal frente a unas champas	18.50	8	1
9	2022-02-23	Primer Parqueo, calle principal frente a unas champas	15.00	9	1
1	2022-03-03	Tercer Parqueo, calle principal frente a unas champas	25.30	1	1
10	2022-02-22	casa frente de color azul frente al Ricaldone	53.39	10	2
\.


--
-- TOC entry 3491 (class 0 OID 18575)
-- Dependencies: 230
-- Data for Name: pedidos_personalizados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pedidos_personalizados (id_pedidos_personalizado, fecha_pedidopersonal, descripcion_pedidopersonal, imagenejemplo_pedidopersonal, descripcionlugar_entrega, fk_id_cliente, fk_id_tamano, fk_id_estado) FROM stdin;
1	2022-02-24	muñeco de superman	harrypotter.png	frente a un chalet verde	1	2	1
2	2022-03-10	muñeco de batman	amigurumi2.png	frente a un chalet naranja	2	2	1
3	2022-03-17	muñeco de robin	amigurumi2.png	frente a un chalet azul	2	2	1
4	2022-03-16	color naranja	amigurumi1.png	Tercer Parque, calle principar frente a unas champas	5	1	2
\.


--
-- TOC entry 3485 (class 0 OID 18231)
-- Dependencies: 224
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productos (id_producto, nombre_producto, imagen_producto, precio_producto, cantidad, fk_id_categoria, fk_id_valoraciones, fk_id_admin, descripcion) FROM stdin;
1	Hello Kitty	hellokitty.png	25.00	45	2	4	1	hello kitty
2	Ratones	harrypotter.png	25.00	25	1	3	1	\N
3	Cerdita	harrypotter.png	25.00	32	1	4	2	\N
5	Mario Bros	harrypotter.png	25.00	0	4	4	3	\N
6	Cactus	harrypotter.png	25.00	40	5	3	3	\N
7	Patito	harrypotter.png	25.00	18	1	4	4	\N
8	Mafalda	harrypotter.png	25.00	0	3	5	4	\N
10	Jirafas con Rosa	harrypotter.png	25.00	27	1	4	5	\N
11	Winnie Poh	harrypotter.png	25.00	35	1	5	1	\N
12	Papu Poh	harrypotter.png	25.00	35	1	5	1	\N
4	Snoopy	harrypotter.png	25.00	21	3	5	2	\N
9	Harry Potter	harrypotter.png	25.00	22	2	5	5	\N
13	ssd	harrypotter.png	25.00	100	6	5	1	dsdsd
\.


--
-- TOC entry 3475 (class 0 OID 18152)
-- Dependencies: 214
-- Data for Name: tamanos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tamanos (id_tamanos, tamano) FROM stdin;
1	Grande:21cm a 35cm
2	Mediano:13cm a 20cm
3	Pequeño:12cm o menos
\.


--
-- TOC entry 3483 (class 0 OID 18222)
-- Dependencies: 222
-- Data for Name: valoraciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.valoraciones (id_valoraciones, valoraciones) FROM stdin;
1	1
2	2
3	3
4	4
5	5
\.


--
-- TOC entry 3489 (class 0 OID 18529)
-- Dependencies: 228
-- Data for Name: valoraciones_clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.valoraciones_clientes (id_valoracionescli, comentario, fk_id_cliente, fk_id_productos, fk_id_valoraciones) FROM stdin;
1	Gran producto	1	1	5
6	Meh de producto	2	1	4
7	Guto producto	3	1	4
9	Meh de producto	2	1	5
10	Guto producto	3	1	5
11	Meh de producto	2	1	4
12	Guto producto	3	1	4
13	Meh de producto	2	1	4
15	Producto muy bueno, recomendado	1	1	1
16	Producto muy malo, recomendado para tus enemigos	1	1	1
\.


--
-- TOC entry 3511 (class 0 OID 0)
-- Dependencies: 209
-- Name: admins_id_admin_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_admin_seq', 6, true);


--
-- TOC entry 3512 (class 0 OID 0)
-- Dependencies: 219
-- Name: categorias_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_categoria_seq', 11, true);


--
-- TOC entry 3513 (class 0 OID 0)
-- Dependencies: 211
-- Name: clientes_id_cliente_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clientes_id_cliente_seq', 15, true);


--
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 225
-- Name: detallepedidos_establecidos_id_detalle_pedidos_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detallepedidos_establecidos_id_detalle_pedidos_seq', 35, true);


--
-- TOC entry 3515 (class 0 OID 0)
-- Dependencies: 215
-- Name: estados_id_estados_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estados_id_estados_seq', 10, true);


--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 234
-- Name: inventario_id_inventario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventario_id_inventario_seq', 5, true);


--
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 217
-- Name: pedidos_establecidos_id_pedidos_establecidos_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedidos_establecidos_id_pedidos_establecidos_seq', 11, true);


--
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 229
-- Name: pedidos_personalizados_id_pedidos_personalizado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedidos_personalizados_id_pedidos_personalizado_seq', 4, true);


--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 223
-- Name: productos_id_producto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_id_producto_seq', 13, true);


--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 213
-- Name: tamanos_id_tamanos_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tamanos_id_tamanos_seq', 3, true);


--
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 227
-- Name: valoraciones_clientes_id_valoracionescli_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.valoraciones_clientes_id_valoracionescli_seq', 16, true);


--
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 221
-- Name: valoraciones_id_valoraciones_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.valoraciones_id_valoraciones_seq', 5, true);


--
-- TOC entry 3263 (class 2606 OID 18131)
-- Name: admins admins_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pk PRIMARY KEY (id_admin);


--
-- TOC entry 3265 (class 2606 OID 18133)
-- Name: admins admins_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_usuario_key UNIQUE (usuario);


--
-- TOC entry 3287 (class 2606 OID 18220)
-- Name: categorias categorias_nombre_categoria_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_nombre_categoria_key UNIQUE (nombre_categoria);


--
-- TOC entry 3289 (class 2606 OID 18218)
-- Name: categorias categorias_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pk PRIMARY KEY (id_categoria);


--
-- TOC entry 3267 (class 2606 OID 18142)
-- Name: clientes cliente_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT cliente_pk PRIMARY KEY (id_cliente);


--
-- TOC entry 3269 (class 2606 OID 18144)
-- Name: clientes clientes_correo_cliente_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_correo_cliente_key UNIQUE (correo_cliente);


--
-- TOC entry 3271 (class 2606 OID 18146)
-- Name: clientes clientes_dui_cliente_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_dui_cliente_key UNIQUE (dui_cliente);


--
-- TOC entry 3273 (class 2606 OID 18148)
-- Name: clientes clientes_telefono_cliente_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_telefono_cliente_key UNIQUE (telefono_cliente);


--
-- TOC entry 3275 (class 2606 OID 18150)
-- Name: clientes clientes_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_usuario_key UNIQUE (usuario);


--
-- TOC entry 3299 (class 2606 OID 18262)
-- Name: detallepedidos_establecidos detallepedidos_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallepedidos_establecidos
    ADD CONSTRAINT detallepedidos_pk PRIMARY KEY (id_detalle_pedidos);


--
-- TOC entry 3281 (class 2606 OID 18168)
-- Name: estados estados_estado_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados
    ADD CONSTRAINT estados_estado_key UNIQUE (estado);


--
-- TOC entry 3283 (class 2606 OID 18166)
-- Name: estados estados_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados
    ADD CONSTRAINT estados_pk PRIMARY KEY (id_estados);


--
-- TOC entry 3305 (class 2606 OID 27342)
-- Name: inventario inventario_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_pk PRIMARY KEY (id_inventario);


--
-- TOC entry 3303 (class 2606 OID 18582)
-- Name: pedidos_personalizados pedidos_personalizados_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos_personalizados
    ADD CONSTRAINT pedidos_personalizados_pk PRIMARY KEY (id_pedidos_personalizado);


--
-- TOC entry 3285 (class 2606 OID 18201)
-- Name: pedidos_establecidos pedidosesta_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos_establecidos
    ADD CONSTRAINT pedidosesta_pk PRIMARY KEY (id_pedidos_establecidos);


--
-- TOC entry 3295 (class 2606 OID 18240)
-- Name: productos productos_nombre_producto_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_nombre_producto_key UNIQUE (nombre_producto);


--
-- TOC entry 3297 (class 2606 OID 18238)
-- Name: productos productos_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pk PRIMARY KEY (id_producto);


--
-- TOC entry 3277 (class 2606 OID 18157)
-- Name: tamanos tamanos_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tamanos
    ADD CONSTRAINT tamanos_pk PRIMARY KEY (id_tamanos);


--
-- TOC entry 3279 (class 2606 OID 18159)
-- Name: tamanos tamanos_tamano_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tamanos
    ADD CONSTRAINT tamanos_tamano_key UNIQUE (tamano);


--
-- TOC entry 3301 (class 2606 OID 18536)
-- Name: valoraciones_clientes valoraciones_clientes_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valoraciones_clientes
    ADD CONSTRAINT valoraciones_clientes_pk PRIMARY KEY (id_valoracionescli);


--
-- TOC entry 3291 (class 2606 OID 18227)
-- Name: valoraciones valoraciones_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valoraciones
    ADD CONSTRAINT valoraciones_pk PRIMARY KEY (id_valoraciones);


--
-- TOC entry 3293 (class 2606 OID 27356)
-- Name: valoraciones valoraciones_valoraciones_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valoraciones
    ADD CONSTRAINT valoraciones_valoraciones_key UNIQUE (valoraciones);


--
-- TOC entry 3324 (class 2620 OID 18481)
-- Name: detallepedidos_establecidos tr_actualizarcantidadprd; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tr_actualizarcantidadprd AFTER INSERT ON public.detallepedidos_establecidos FOR EACH ROW EXECUTE FUNCTION public.actualizarcantidadprodct();


--
-- TOC entry 3327 (class 2620 OID 27354)
-- Name: inventario tr_actualizarcpi; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tr_actualizarcpi AFTER INSERT ON public.inventario FOR EACH ROW EXECUTE FUNCTION public.actualizarcantidadprdi();


--
-- TOC entry 3325 (class 2620 OID 18455)
-- Name: detallepedidos_establecidos tr_actualizarmonto; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tr_actualizarmonto AFTER INSERT ON public.detallepedidos_establecidos FOR EACH ROW EXECUTE FUNCTION public.actualizarmontopedido();


--
-- TOC entry 3323 (class 2620 OID 35499)
-- Name: detallepedidos_establecidos tr_actualizarsubtotal; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tr_actualizarsubtotal AFTER INSERT ON public.detallepedidos_establecidos FOR EACH ROW EXECUTE FUNCTION public.actualizarsubtotal();


--
-- TOC entry 3326 (class 2620 OID 18557)
-- Name: valoraciones_clientes tr_actualizarvaloracion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tr_actualizarvaloracion AFTER INSERT ON public.valoraciones_clientes FOR EACH ROW EXECUTE FUNCTION public.actualizarvaloracion();


--
-- TOC entry 3306 (class 2606 OID 35491)
-- Name: admins admins_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_fk FOREIGN KEY (fk_id_estado) REFERENCES public.estados(id_estados) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3307 (class 2606 OID 27294)
-- Name: clientes clientes_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_fk FOREIGN KEY (fk_id_estado) REFERENCES public.estados(id_estados) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3314 (class 2606 OID 18268)
-- Name: detallepedidos_establecidos detallepedidos_pedidosesta_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallepedidos_establecidos
    ADD CONSTRAINT detallepedidos_pedidosesta_fk FOREIGN KEY (fk_id_pedidos_establecidos) REFERENCES public.pedidos_establecidos(id_pedidos_establecidos) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3313 (class 2606 OID 18263)
-- Name: detallepedidos_establecidos detallepedidos_productos_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallepedidos_establecidos
    ADD CONSTRAINT detallepedidos_productos_fk FOREIGN KEY (fk_id_producto) REFERENCES public.productos(id_producto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3321 (class 2606 OID 27343)
-- Name: inventario inventario_admins_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_admins_fk FOREIGN KEY (fk_id_admin) REFERENCES public.admins(id_admin) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3322 (class 2606 OID 27348)
-- Name: inventario inventario_productos_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_productos_fk FOREIGN KEY (fk_id_producto) REFERENCES public.productos(id_producto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3318 (class 2606 OID 18583)
-- Name: pedidos_personalizados pedidos_personalizados_clientes_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos_personalizados
    ADD CONSTRAINT pedidos_personalizados_clientes_fk FOREIGN KEY (fk_id_cliente) REFERENCES public.clientes(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3320 (class 2606 OID 18593)
-- Name: pedidos_personalizados pedidos_personalizados_estados_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos_personalizados
    ADD CONSTRAINT pedidos_personalizados_estados_fk FOREIGN KEY (fk_id_estado) REFERENCES public.estados(id_estados) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3319 (class 2606 OID 18588)
-- Name: pedidos_personalizados pedidos_personalizados_tamanos_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos_personalizados
    ADD CONSTRAINT pedidos_personalizados_tamanos_fk FOREIGN KEY (fk_id_tamano) REFERENCES public.tamanos(id_tamanos) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3308 (class 2606 OID 18202)
-- Name: pedidos_establecidos pedidosesta_clientes_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos_establecidos
    ADD CONSTRAINT pedidosesta_clientes_fk FOREIGN KEY (fk_id_cliente) REFERENCES public.clientes(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3309 (class 2606 OID 18207)
-- Name: pedidos_establecidos pedidosesta_estados_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos_establecidos
    ADD CONSTRAINT pedidosesta_estados_fk FOREIGN KEY (fk_id_estado) REFERENCES public.estados(id_estados) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3312 (class 2606 OID 18251)
-- Name: productos productos_admin_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_admin_fk FOREIGN KEY (fk_id_admin) REFERENCES public.admins(id_admin) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3310 (class 2606 OID 18241)
-- Name: productos productos_categorias_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_categorias_fk FOREIGN KEY (fk_id_categoria) REFERENCES public.categorias(id_categoria) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3311 (class 2606 OID 18246)
-- Name: productos productos_valoraciones_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_valoraciones_fk FOREIGN KEY (fk_id_valoraciones) REFERENCES public.valoraciones(id_valoraciones) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3315 (class 2606 OID 18537)
-- Name: valoraciones_clientes valoraciones_cliente_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valoraciones_clientes
    ADD CONSTRAINT valoraciones_cliente_fk FOREIGN KEY (fk_id_cliente) REFERENCES public.clientes(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3316 (class 2606 OID 18542)
-- Name: valoraciones_clientes valoraciones_clientes_productos_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valoraciones_clientes
    ADD CONSTRAINT valoraciones_clientes_productos_fk FOREIGN KEY (fk_id_productos) REFERENCES public.productos(id_producto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3317 (class 2606 OID 18547)
-- Name: valoraciones_clientes valoraciones_clientes_valoraciones_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valoraciones_clientes
    ADD CONSTRAINT valoraciones_clientes_valoraciones_fk FOREIGN KEY (fk_id_valoraciones) REFERENCES public.valoraciones(id_valoraciones) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2022-05-13 17:01:55

--
-- PostgreSQL database dump complete
--

