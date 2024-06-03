--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4
-- Dumped by pg_dump version 16.2

-- Started on 2024-06-03 12:50:26 MSK

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
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 3260 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 201 (class 1259 OID 1662294)
-- Name: table_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.table_data (
    id uuid NOT NULL,
    createdat timestamp without time zone DEFAULT now() NOT NULL,
    updatedat timestamp without time zone DEFAULT now() NOT NULL,
    createdby text,
    data jsonb,
    table_id character varying(255)
);


ALTER TABLE public.table_data OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 1662286)
-- Name: table_meta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.table_meta (
    id uuid NOT NULL,
    createdat timestamp without time zone DEFAULT now() NOT NULL,
    updatedat timestamp without time zone DEFAULT now() NOT NULL,
    createdby text,
    meta jsonb,
    table_id character varying(255)
);


ALTER TABLE public.table_meta OWNER TO postgres;

--
-- TOC entry 3254 (class 0 OID 1662294)
-- Dependencies: 201
-- Data for Name: table_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.table_data VALUES ('37507a3b-e362-4842-8304-40276c3dea80', '2024-05-31 11:41:06.814167', '2024-05-31 11:41:06.814167', 'admin', '{"age": 32, "name": "John Brown", "address": "New York No. 1 Lake Park"}', '1');
INSERT INTO public.table_data VALUES ('37507a3b-e362-4842-8304-40276c3dea81', '2024-05-31 11:41:06.814167', '2024-05-31 11:41:06.814167', 'admin', '{"age": 42, "name": "Jim Green", "address": "London No. 1 Lake Park"}', '1');
INSERT INTO public.table_data VALUES ('37507a3b-e362-4842-8304-40276c3dea82', '2024-05-31 11:41:06.814167', '2024-05-31 11:41:06.814167', 'admin', '{"age": 32, "name": "Joe Black", "address": "Sydney No. 1 Lake Park"}', '1');
INSERT INTO public.table_data VALUES ('37507a3b-e362-4842-8304-40276c3dea83', '2024-05-31 11:41:06.814167', '2024-05-31 11:41:06.814167', 'admin', '{"country": "India", "population": 1427104000}', '2');
INSERT INTO public.table_data VALUES ('37507a3b-e362-4842-8304-40276c3dea84', '2024-05-31 11:41:06.814167', '2024-05-31 11:41:06.814167', 'admin', '{"country": "China", "population": 1411750000}', '2');


--
-- TOC entry 3253 (class 0 OID 1662286)
-- Dependencies: 200
-- Data for Name: table_meta; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.table_meta VALUES ('37507a3b-e362-4842-8304-40276c3dea80', '2024-05-31 11:08:08.799463', '2024-05-31 11:08:08.799463', 'admin', '[{"title": "Name", "dataIndex": "name"}, {"title": "Age", "dataIndex": "age"}, {"title": "Address", "dataIndex": "address"}]', '1');
INSERT INTO public.table_meta VALUES ('37507a3b-e362-4842-8304-40276c3dea81', '2024-05-31 11:08:08.799463', '2024-05-31 11:08:08.799463', 'admin', '[{"title": "Country", "dataIndex": "country"}, {"title": "Population", "dataIndex": "population"}]', '2');


--
-- TOC entry 3261 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2024-06-03 12:50:26 MSK

--
-- PostgreSQL database dump complete
--

