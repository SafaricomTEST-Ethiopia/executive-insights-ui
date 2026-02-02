CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO departments (name) VALUES ('CVM'), ('Digital'), ('ESB'), ('Ops');
