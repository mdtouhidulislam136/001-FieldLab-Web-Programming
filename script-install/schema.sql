-- schema.sql

CREATE DATABASE test_db;

-- Make sure we're using our `test_db` database
\c test_db;

-- We can create our user table
CREATE TABLE IF NOT EXISTS public.robotti
(value double precision,
name text COLLATE pg_catalog."default",
quality text COLLATE pg_catalog."default",
"time" timestamp without time zone
);

-- Test the database
INSERT INTO public.robotti
(name, value, quality, time) VALUES ('test', 1.00, 'yup_test', '2020-01-01 00:00:00');
