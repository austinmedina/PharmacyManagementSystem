-- Migration number: 0001      2024-10-13T01:57:01.070Z
CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY NOT NULL,
    first_name    TEXT NOT NULL,
    last_name     TEXT NOT NULL,
    username      TEXT NOT NULL,
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
    product       INTEGER NOT NULL,
    patient       INTEGER NOT NULL,
    quantity      INTEGER NOT NULL,
    period        INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory (
      id          INTEGER PRIMARY KEY NOT NULL,
      product     INTEGER NOT NULL,
      expiration  TEXT NOT NULL,
      quantity    INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS logloglog (
    id            INTEGER PRIMARY KEY NOT NULL,
    time          TEXT NOT NULL,
    user          INTEGER NOT NULL,
    action        INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS purchase_log (
    id             INTEGER PRIMARY KEY NOT NULL,
    time           TEXT NOT NULL,
    item           INTEGER NOT NULL,
    price          INTEGER NOT NULL,
    quantity       INTEGER NOT NULL,
    cart           TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory_log (
    id             INTEGER PRIMARY KEY NOT NULL,
    time           TEXT NOT NULL,
    product        INTEGER NOT NULL,
    action         INTEGER NOT NULL,
    quantity       INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id             INTEGER PRIMARY KEY NOT NULL,
    name           TEXT NOT NULL,
    type           INTEGER NOT NULL,
    price          INTEGER NOT NULL
);