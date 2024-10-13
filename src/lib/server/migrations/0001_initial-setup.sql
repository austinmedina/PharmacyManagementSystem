-- Migration number: 0001      2024-10-13T01:57:01.070Z
CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY NOT NULL,
    first_name    TEXT NOT NULL,
    last_name     TEXT NOT NULL,
    username      TEXT NOT NULL UNIQUE,
    password      TEXT NOT NULL,
    userType      INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS patients (
    id            INTEGER PRIMARY KEY NOT NULL,
    first_name    TEXT NOT NULL,
    last_name     TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    email         TEXT NOT NULL,
    phone         TEXT NOT NULL,
    insurance     BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id            INTEGER PRIMARY KEY NOT NULL,
    product_id    INTEGER NOT NULL,
    patient_id    INTEGER NOT NULL,
    quantity      INTEGER NOT NULL,
    period        INTEGER NOT NULL,
    filled        BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS inventory (
    id          INTEGER PRIMARY KEY NOT NULL,
    product_id  INTEGER NOT NULL,
    expiration  TEXT NOT NULL,
    quantity    INTEGER NOT NULL CHECK (quantity >= 0),
    FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS logloglog (
    id            INTEGER PRIMARY KEY NOT NULL,
    time          TEXT NOT NULL,
    user_id       INTEGER NOT NULL,
    action        INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS purchase_log (
    id             INTEGER PRIMARY KEY NOT NULL,
    time           TEXT NOT NULL,
    item_id        INTEGER NOT NULL,
    price          INTEGER NOT NULL,
    quantity       INTEGER NOT NULL,
    cart_id        TEXT NOT NULL,
    FOREIGN KEY(item_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS inventory_log (
    id             INTEGER PRIMARY KEY NOT NULL,
    time           TEXT NOT NULL,
    product_id     INTEGER NOT NULL,
    action         INTEGER NOT NULL,
    quantity       INTEGER NOT NULL,
    FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS products (
    id             INTEGER PRIMARY KEY NOT NULL,
    name           TEXT NOT NULL,
    type           INTEGER NOT NULL,
    price          INTEGER NOT NULL
);