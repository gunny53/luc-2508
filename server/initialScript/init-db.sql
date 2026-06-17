English content normalized from the original source text.
SELECT 'CREATE DATABASE ecsite'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ecsite')\gexec

English content normalized from the original source text.
\c ecsite;

English content normalized from the original source text.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
