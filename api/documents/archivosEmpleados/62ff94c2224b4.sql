--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1

-- Started on 2022-04-15 14:38:19

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 27095)
-- Name: archivos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.archivos (
    id_archivo integer NOT NULL,
    nombre_archivo character varying(200) NOT NULL,
    fecha_subida date NOT NULL,
    fk_id_folder integer NOT NULL
);


ALTER TABLE public.archivos OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 27094)
-- Name: archivos_id_archivo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.archivos_id_archivo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.archivos_id_archivo_seq OWNER TO postgres;

--
-- TOC entry 3391 (class 0 OID 0)
-- Dependencies: 219
-- Name: archivos_id_archivo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.archivos_id_archivo_seq OWNED BY public.archivos.id_archivo;


--
-- TOC entry 224 (class 1259 OID 27124)
-- Name: archivos_subidosemp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.archivos_subidosemp (
    id_archivos_subidosemp integer NOT NULL,
    nombre_archivo character varying(200) NOT NULL,
    fecha_subida date NOT NULL,
    descripcion character varying(150) NOT NULL,
    fk_id_empleado integer NOT NULL,
    fk_id_empresa integer NOT NULL,
    fk_id_estado integer NOT NULL
);


ALTER TABLE public.archivos_subidosemp OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 27123)
-- Name: archivos_subidosemp_id_archivos_subidosemp_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.archivos_subidosemp_id_archivos_subidosemp_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.archivos_subidosemp_id_archivos_subidosemp_seq OWNER TO postgres;

--
-- TOC entry 3392 (class 0 OID 0)
-- Dependencies: 223
-- Name: archivos_subidosemp_id_archivos_subidosemp_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.archivos_subidosemp_id_archivos_subidosemp_seq OWNED BY public.archivos_subidosemp.id_archivos_subidosemp;


--
-- TOC entry 212 (class 1259 OID 27053)
-- Name: empleados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empleados (
    id_empleado integer NOT NULL,
    nombre_empleado character varying(100) NOT NULL,
    apellido_empleado character varying(100) NOT NULL,
    dui_empleado character varying(10) NOT NULL,
    telefono_empleadocontc character varying(9) NOT NULL,
    correo_empleadocontc character varying(55) NOT NULL,
    usuario_empleado character varying(100) NOT NULL,
    contrasena_empleado character varying(500) NOT NULL,
    fk_id_tipo_empleado integer NOT NULL
);


ALTER TABLE public.empleados OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 27052)
-- Name: empleados_id_empleado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empleados_id_empleado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.empleados_id_empleado_seq OWNER TO postgres;

--
-- TOC entry 3393 (class 0 OID 0)
-- Dependencies: 211
-- Name: empleados_id_empleado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empleados_id_empleado_seq OWNED BY public.empleados.id_empleado;


--
-- TOC entry 216 (class 1259 OID 27074)
-- Name: empresas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresas (
    id_empresa integer NOT NULL,
    nombre_cliente character varying(100) NOT NULL,
    apellido_cliente character varying(100) NOT NULL,
    nombre_empresa character varying(100) NOT NULL,
    numero_empresacontc character varying(9),
    correo_empresacontc character varying(55),
    direccion_empresa character varying(150),
    nit_empresa character varying(20)
);


ALTER TABLE public.empresas OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 27107)
-- Name: empresas_empleados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresas_empleados (
    id_empresas_empleado integer NOT NULL,
    fk_id_empleado integer NOT NULL,
    fk_id_empresa integer NOT NULL
);


ALTER TABLE public.empresas_empleados OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 27106)
-- Name: empresas_empleados_id_empresas_empleado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empresas_empleados_id_empresas_empleado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.empresas_empleados_id_empresas_empleado_seq OWNER TO postgres;

--
-- TOC entry 3394 (class 0 OID 0)
-- Dependencies: 221
-- Name: empresas_empleados_id_empresas_empleado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empresas_empleados_id_empresas_empleado_seq OWNED BY public.empresas_empleados.id_empresas_empleado;


--
-- TOC entry 215 (class 1259 OID 27073)
-- Name: empresas_id_empresa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empresas_id_empresa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.empresas_id_empresa_seq OWNER TO postgres;

--
-- TOC entry 3395 (class 0 OID 0)
-- Dependencies: 215
-- Name: empresas_id_empresa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empresas_id_empresa_seq OWNED BY public.empresas.id_empresa;


--
-- TOC entry 214 (class 1259 OID 27067)
-- Name: estados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estados (
    id_estado integer NOT NULL,
    nombre_estado character varying(100) NOT NULL
);


ALTER TABLE public.estados OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 27066)
-- Name: estados_id_estado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estados_id_estado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.estados_id_estado_seq OWNER TO postgres;

--
-- TOC entry 3396 (class 0 OID 0)
-- Dependencies: 213
-- Name: estados_id_estado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estados_id_estado_seq OWNED BY public.estados.id_estado;


--
-- TOC entry 218 (class 1259 OID 27083)
-- Name: folders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.folders (
    id_folder integer NOT NULL,
    nombre_folder character varying(100) NOT NULL,
    fk_id_empresa integer NOT NULL
);


ALTER TABLE public.folders OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 27082)
-- Name: folders_id_folder_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.folders_id_folder_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.folders_id_folder_seq OWNER TO postgres;

--
-- TOC entry 3397 (class 0 OID 0)
-- Dependencies: 217
-- Name: folders_id_folder_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.folders_id_folder_seq OWNED BY public.folders.id_folder;


--
-- TOC entry 210 (class 1259 OID 27046)
-- Name: tipo_empleado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_empleado (
    id_tipo_empleado integer NOT NULL,
    tipo_empleado character varying(50) NOT NULL
);


ALTER TABLE public.tipo_empleado OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 27045)
-- Name: tipo_empleado_id_tipo_empleado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_empleado_id_tipo_empleado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tipo_empleado_id_tipo_empleado_seq OWNER TO postgres;

--
-- TOC entry 3398 (class 0 OID 0)
-- Dependencies: 209
-- Name: tipo_empleado_id_tipo_empleado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_empleado_id_tipo_empleado_seq OWNED BY public.tipo_empleado.id_tipo_empleado;


--
-- TOC entry 3204 (class 2604 OID 27098)
-- Name: archivos id_archivo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos ALTER COLUMN id_archivo SET DEFAULT nextval('public.archivos_id_archivo_seq'::regclass);


--
-- TOC entry 3206 (class 2604 OID 27127)
-- Name: archivos_subidosemp id_archivos_subidosemp; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos_subidosemp ALTER COLUMN id_archivos_subidosemp SET DEFAULT nextval('public.archivos_subidosemp_id_archivos_subidosemp_seq'::regclass);


--
-- TOC entry 3200 (class 2604 OID 27056)
-- Name: empleados id_empleado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados ALTER COLUMN id_empleado SET DEFAULT nextval('public.empleados_id_empleado_seq'::regclass);


--
-- TOC entry 3202 (class 2604 OID 27077)
-- Name: empresas id_empresa; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas ALTER COLUMN id_empresa SET DEFAULT nextval('public.empresas_id_empresa_seq'::regclass);


--
-- TOC entry 3205 (class 2604 OID 27110)
-- Name: empresas_empleados id_empresas_empleado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas_empleados ALTER COLUMN id_empresas_empleado SET DEFAULT nextval('public.empresas_empleados_id_empresas_empleado_seq'::regclass);


--
-- TOC entry 3201 (class 2604 OID 27070)
-- Name: estados id_estado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados ALTER COLUMN id_estado SET DEFAULT nextval('public.estados_id_estado_seq'::regclass);


--
-- TOC entry 3203 (class 2604 OID 27086)
-- Name: folders id_folder; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.folders ALTER COLUMN id_folder SET DEFAULT nextval('public.folders_id_folder_seq'::regclass);


--
-- TOC entry 3199 (class 2604 OID 27049)
-- Name: tipo_empleado id_tipo_empleado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_empleado ALTER COLUMN id_tipo_empleado SET DEFAULT nextval('public.tipo_empleado_id_tipo_empleado_seq'::regclass);


--
-- TOC entry 3381 (class 0 OID 27095)
-- Dependencies: 220
-- Data for Name: archivos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.archivos (id_archivo, nombre_archivo, fecha_subida, fk_id_folder) FROM stdin;
1	semper erat,	2021-12-24	10
2	arcu ac	2022-01-23	10
3	adipiscing lobortis	2021-11-15	10
4	lobortis augue	2022-05-21	10
5	Phasellus dapibus	2022-07-28	10
6	consectetuer ipsum	2022-01-14	5
7	nisi nibh	2021-04-26	2
8	Maecenas ornare	2022-01-09	5
9	ut odio	2022-06-16	1
10	sed sem	2022-06-16	2
\.


--
-- TOC entry 3385 (class 0 OID 27124)
-- Dependencies: 224
-- Data for Name: archivos_subidosemp; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.archivos_subidosemp (id_archivos_subidosemp, nombre_archivo, fecha_subida, descripcion, fk_id_empleado, fk_id_empresa, fk_id_estado) FROM stdin;
1	Praesent eu	2023-01-13	lacus. Quisque purus sapien,	6	9	1
2	ante dictum	2021-11-11	convallis erat, eget tincidunt	9	2	1
3	sit amet	2021-10-16	tempus scelerisque, lorem ipsum	8	7	1
4	ut, sem.	2022-10-11	augue eu tellus. Phasellus	4	1	1
5	risus. Donec	2021-06-15	elit. Aliquam auctor, velit	7	5	1
6	Praesent interdum	2021-06-08	mauris erat eget ipsum. Suspendisse	5	2	1
7	ante dictum	2021-08-28	non massa non ante bibendum	7	5	1
8	Cras vulputate	2021-11-02	ipsum dolor sit amet, consectetuer	5	3	1
9	ac mattis	2021-06-28	sagittis. Duis gravida. Praesent eu	3	7	1
10	pharetra ut,	2022-05-26	Donec tempus, lorem fringilla ornare	2	2	1
11	orci luctus	2022-02-09	facilisis, magna tellus faucibus leo,	4	8	1
12	nec, mollis	2021-06-29	Curabitur dictum. Phasellus in felis.	6	4	1
13	lacinia vitae,	2021-08-09	Cras dolor dolor, tempus non,	7	10	1
14	vulputate ullamcorper	2022-05-21	scelerisque neque. Nullam nisl. Maecenas	8	6	1
15	hendrerit neque.	2021-12-18	netus et malesuada fames ac	2	10	1
16	ac sem	2022-09-01	bibendum fermentum metus. Aenean sed	2	9	1
17	at lacus.	2022-05-02	neque tellus, imperdiet non, vestibulum	2	10	1
18	ornare. Fusce	2023-01-12	nunc. In at pede. Cras	2	4	1
19	leo. Morbi	2023-04-07	rhoncus id, mollis nec, cursus	4	5	1
20	Fusce aliquam,	2022-02-18	iaculis nec, eleifend non, dapibus	4	8	1
21	laoreet ipsum.	2022-04-28	mi. Duis risus odio, auctor	5	9	1
22	nisl. Maecenas	2021-12-30	sollicitudin commodo ipsum. Suspendisse non	3	7	1
23	ipsum. Suspendisse	2021-11-22	at auctor ullamcorper, nisl arcu	4	4	1
24	Mauris non	2022-05-30	erat eget ipsum. Suspendisse sagittis.	9	3	1
25	commodo auctor	2021-04-20	risus. Nunc ac sem ut	9	10	1
26	Sed congue,	2022-02-07	ipsum primis in faucibus orci	6	2	1
27	Sed nulla	2021-09-25	vestibulum nec, euismod in, dolor.	6	5	1
28	nascetur ridiculus	2023-02-11	vel, convallis in, cursus et,	9	10	1
29	dui. Cum	2021-05-08	Donec vitae erat vel pede	10	9	1
30	eleifend. Cras	2023-03-03	libero at auctor ullamcorper, nisl	4	2	1
\.


--
-- TOC entry 3373 (class 0 OID 27053)
-- Dependencies: 212
-- Data for Name: empleados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empleados (id_empleado, nombre_empleado, apellido_empleado, dui_empleado, telefono_empleadocontc, correo_empleadocontc, usuario_empleado, contrasena_empleado, fk_id_tipo_empleado) FROM stdin;
1	Salvador	Ball	17831201-4	591-5447	ball.salvador@gmail.com	Salvador245	LU71NEI3VR	3
2	Elliott	Decker	40180680-6	148-7113	delliott5601@gmail.com	Michael	PK12NTE5EF	3
3	Shay	Pacheco	28768781-8	332-5156	pacheco-shay3385@gmail.com	Evan	YQ63OLC6VB	2
4	Brody	Mayo	9399716-6	548-5201	b_mayo7190@gmail.com	Basil	WC98URS0ED	3
5	Pearl	Mullen	22757810-6	324-7481	mullen-pearl@gmail.com	Xenos	GC46YCW6WK	2
6	Brandon	Weber	29281111-K	487-5892	w.brandon@gmail.com	Ahmed	QKL58HDY7BM	2
7	Daniel	Hopper	10928607-9	450-8132	h.daniel3040@gmail.com	Robin	ETK58ULQ5UU	1
8	Linus	Bond	40253593-8	758-8725	bond.linus@gmail.com	Yen	MED15KIM9TZ	1
9	Malachi	Wilkerson	30830692-5	724-7766	wilkerson.malachi4193@gmail.com	Noel	MCP31WQK2RE	1
10	Gemma	Leonard	4929294-5	956-5513	leonard-gemma9157@gmail.com	Hilel	QHQ18AWT7ZP	1
\.


--
-- TOC entry 3377 (class 0 OID 27074)
-- Dependencies: 216
-- Data for Name: empresas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresas (id_empresa, nombre_cliente, apellido_cliente, nombre_empresa, numero_empresacontc, correo_empresacontc, direccion_empresa, nit_empresa) FROM stdin;
1	Bert	Snider	Eros Turpis Ltd	517-1051	snider@gmail.com	Ap #670-3545 Vel Ave	49255381-6
2	Timothy	Norman	Vitae Erat Vel Inc.	752-4620	norman2039@gmail.com	913-8782 Molestie St.	7827912-5
3	Hyatt	Rowland	Sapien Molestie Orci Corp.	361-6738	rowland6515@gmail.com	891-9698 Erat St.	11802878-3
4	Leroy	O'Neill	Eu Euismod Ltd	978-5852	oneill685@gmail.com	441-9126 Lacus. Avenue	929747-2
5	Faith	Rollins	Lorem Industries	935-1633	rollins@gmail.com	181-9901 Gravida Ave	39167171-0
6	Gloria	Moran	Amet Lorem Ltd	165-7534	moran3790@gmail.com	Ap #334-6517 Phasellus Street	30100987-9
7	Rama	Rogers	Ipsum Primis Ltd	932-8168	rogers@gmail.com	Ap #371-479 Tristique Avenue	1323514-7
8	Octavia	Witt	Dapibus Ligula Incorporated	400-6073	witt@gmail.com	340-8607 Nunc Road	42433823-0
9	Remedios	Jenkins	Cursus Et Limited	717-8816	jenkins@gmail.com	270-1322 Quisque St.	21287846-4
10	Maisie	Skinner	Lectus Cum Industries	774-8566	skinner3659@gmail.com	Ap #993-2612 Odio Rd.	9802512-8
\.


--
-- TOC entry 3383 (class 0 OID 27107)
-- Dependencies: 222
-- Data for Name: empresas_empleados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresas_empleados (id_empresas_empleado, fk_id_empleado, fk_id_empresa) FROM stdin;
1	10	8
2	3	4
3	8	3
4	6	6
5	5	9
6	2	6
7	4	4
8	6	6
9	3	4
10	1	10
11	2	7
12	8	7
13	7	1
14	9	8
15	5	9
16	5	4
17	3	8
18	8	3
19	9	1
20	6	7
21	3	7
22	10	4
23	6	8
24	2	2
25	4	3
26	2	9
27	2	5
28	3	4
29	10	1
30	4	5
\.


--
-- TOC entry 3375 (class 0 OID 27067)
-- Dependencies: 214
-- Data for Name: estados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estados (id_estado, nombre_estado) FROM stdin;
1	No descargado
2	Descargado
3	Eliminado
\.


--
-- TOC entry 3379 (class 0 OID 27083)
-- Dependencies: 218
-- Data for Name: folders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.folders (id_folder, nombre_folder, fk_id_empresa) FROM stdin;
1	Duis	9
2	adipiscing elit.	6
3	tristique neque	4
4	arcu.	4
5	Proin mi.	5
6	Cras	9
7	dui. Cras	5
8	semper tellus	6
9	id, libero.	5
10	nisi dictum	6
\.


--
-- TOC entry 3371 (class 0 OID 27046)
-- Dependencies: 210
-- Data for Name: tipo_empleado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_empleado (id_tipo_empleado, tipo_empleado) FROM stdin;
1	Pasantia
2	Temporal
3	Tiempo completo
\.


--
-- TOC entry 3399 (class 0 OID 0)
-- Dependencies: 219
-- Name: archivos_id_archivo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.archivos_id_archivo_seq', 10, true);


--
-- TOC entry 3400 (class 0 OID 0)
-- Dependencies: 223
-- Name: archivos_subidosemp_id_archivos_subidosemp_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.archivos_subidosemp_id_archivos_subidosemp_seq', 30, true);


--
-- TOC entry 3401 (class 0 OID 0)
-- Dependencies: 211
-- Name: empleados_id_empleado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empleados_id_empleado_seq', 10, true);


--
-- TOC entry 3402 (class 0 OID 0)
-- Dependencies: 221
-- Name: empresas_empleados_id_empresas_empleado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empresas_empleados_id_empresas_empleado_seq', 30, true);


--
-- TOC entry 3403 (class 0 OID 0)
-- Dependencies: 215
-- Name: empresas_id_empresa_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empresas_id_empresa_seq', 10, true);


--
-- TOC entry 3404 (class 0 OID 0)
-- Dependencies: 213
-- Name: estados_id_estado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estados_id_estado_seq', 3, true);


--
-- TOC entry 3405 (class 0 OID 0)
-- Dependencies: 217
-- Name: folders_id_folder_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.folders_id_folder_seq', 10, true);


--
-- TOC entry 3406 (class 0 OID 0)
-- Dependencies: 209
-- Name: tipo_empleado_id_tipo_empleado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_empleado_id_tipo_empleado_seq', 3, true);


--
-- TOC entry 3218 (class 2606 OID 27100)
-- Name: archivos archivos_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos
    ADD CONSTRAINT archivos_pk PRIMARY KEY (id_archivo);


--
-- TOC entry 3222 (class 2606 OID 27129)
-- Name: archivos_subidosemp archivos_subidosemp_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos_subidosemp
    ADD CONSTRAINT archivos_subidosemp_pk PRIMARY KEY (id_archivos_subidosemp);


--
-- TOC entry 3210 (class 2606 OID 27060)
-- Name: empleados empleados_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_pk PRIMARY KEY (id_empleado);


--
-- TOC entry 3220 (class 2606 OID 27112)
-- Name: empresas_empleados empresas_empleados_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas_empleados
    ADD CONSTRAINT empresas_empleados_pk PRIMARY KEY (id_empresas_empleado);


--
-- TOC entry 3214 (class 2606 OID 27081)
-- Name: empresas empresas_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_pk PRIMARY KEY (id_empresa);


--
-- TOC entry 3212 (class 2606 OID 27072)
-- Name: estados estados_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados
    ADD CONSTRAINT estados_pk PRIMARY KEY (id_estado);


--
-- TOC entry 3216 (class 2606 OID 27088)
-- Name: folders foldes_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT foldes_pk PRIMARY KEY (id_folder);


--
-- TOC entry 3208 (class 2606 OID 27051)
-- Name: tipo_empleado tipo_empleados_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_empleado
    ADD CONSTRAINT tipo_empleados_pk PRIMARY KEY (id_tipo_empleado);


--
-- TOC entry 3225 (class 2606 OID 27101)
-- Name: archivos archivos_folders_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos
    ADD CONSTRAINT archivos_folders_fk FOREIGN KEY (fk_id_folder) REFERENCES public.folders(id_folder) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3230 (class 2606 OID 27140)
-- Name: archivos_subidosemp archivos_subidosemp_empresas_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos_subidosemp
    ADD CONSTRAINT archivos_subidosemp_empresas_fk FOREIGN KEY (fk_id_empresa) REFERENCES public.empresas(id_empresa) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3229 (class 2606 OID 27135)
-- Name: archivos_subidosemp archivos_subidosemp_estado_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos_subidosemp
    ADD CONSTRAINT archivos_subidosemp_estado_fk FOREIGN KEY (fk_id_estado) REFERENCES public.estados(id_estado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3228 (class 2606 OID 27130)
-- Name: archivos_subidosemp archivos_subidosemp_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos_subidosemp
    ADD CONSTRAINT archivos_subidosemp_fk FOREIGN KEY (fk_id_empleado) REFERENCES public.empleados(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3223 (class 2606 OID 27061)
-- Name: empleados empleados_tipo_empleado_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_tipo_empleado_fk FOREIGN KEY (fk_id_tipo_empleado) REFERENCES public.tipo_empleado(id_tipo_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3226 (class 2606 OID 27113)
-- Name: empresas_empleados empresas_empleados_empleados_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas_empleados
    ADD CONSTRAINT empresas_empleados_empleados_fk FOREIGN KEY (fk_id_empleado) REFERENCES public.empleados(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3227 (class 2606 OID 27118)
-- Name: empresas_empleados empresas_empleados_empresas_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas_empleados
    ADD CONSTRAINT empresas_empleados_empresas_fk FOREIGN KEY (fk_id_empresa) REFERENCES public.empresas(id_empresa) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3224 (class 2606 OID 27089)
-- Name: folders folders_empresas_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT folders_empresas_fk FOREIGN KEY (fk_id_empresa) REFERENCES public.empresas(id_empresa) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2022-04-15 14:38:20

--
-- PostgreSQL database dump complete
--

