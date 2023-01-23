-- schema.sql
-- create the table if necessary
CREATE TABLE IF NOT EXISTS robottidata (
  value double precision,
  name text COLLATE pg_catalog."default",
  quality text COLLATE pg_catalog."default",
  "time" timestamp without time zone
);
