DROP TABLE IF EXISTS petition;

CREATE TABLE petition (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(99) NOT NULL CHECK (firstname != ''),
    lastname VARCHAR(99) NOT NULL CHECK (lastname != ''),
    signature VARCHAR NOT NULL CHECK (signature != '')
);
