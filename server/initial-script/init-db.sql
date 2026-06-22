SELECT 'CREATE DATABASE ecsite'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ecsite')\gexec

\c ecsite;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
