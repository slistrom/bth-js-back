CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    UNIQUE(email)
);

-- CREATE TABLE IF NOT EXISTS products (
--     name VARCHAR(255) NOT NULL,
--     price REAL NOT NULL,
--     UNIQUE(name)
-- );

CREATE TABLE IF NOT EXISTS depot (
    email VARCHAR(255) NOT NULL,
    value REAL NOT NULL,
    UNIQUE(email)
);


CREATE TABLE IF NOT EXISTS inventory (
    email VARCHAR(255) NOT NULL,
    prodname VARCHAR(255) NOT NULL,
    amount INT NOT NULL
);