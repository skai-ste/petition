DROP TABLE IF EXISTS petition;

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
     signatures TEXT NOT NULL,
     user_id INTEGER NOT NULL,  --REFERENCES users(id)
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
