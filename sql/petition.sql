DROP TABLE IF EXISTS signatures CASCADE;

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL CHECK (signature != ''),
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL CHECK (firstname != ''),
    lastname VARCHAR(255) NOT NULL CHECK (lastname != ''),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS user_profiles CASCADE;

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    age INTEGER,
    city VARCHAR(99),
    url VARCHAR(299),
    user_id INTEGER REFERENCES users(id) NOT NULL UNIQUE
);
