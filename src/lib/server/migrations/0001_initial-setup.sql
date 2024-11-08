-- Migration number: 0001      2024-10-13T01:57:01.070Z
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS session;

CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY NOT NULL,
    firstName     TEXT NOT NULL,
    lastName      TEXT NOT NULL,
    username      TEXT NOT NULL UNIQUE,
    password      TEXT NOT NULL,
    type          INTEGER NOT NULL,
    lockout       BOOLEAN NOT NULL DEFAULT FALSE,
    login_attempts INTEGER NOT NULL DEFAULT 0,
    is_first_login BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS session (
        id VARCHAR(255) PRIMARY KEY,
        user_Id VARCHAR(255),
        expires_at VARCHAR(255),
        fresh BOOLEAN
);

CREATE TABLE IF NOT EXISTS patients (
    id            INTEGER PRIMARY KEY NOT NULL,
    firstName     TEXT NOT NULL,
    lastName      TEXT NOT NULL,
    dateOfBirth   TEXT NOT NULL,
    email         TEXT NOT NULL,
    phone         TEXT NOT NULL,
    address       TEXT NOT NULL,
    insurance     BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id            INTEGER PRIMARY KEY NOT NULL,
    productID     INTEGER NOT NULL,
    patientID     INTEGER NOT NULL,
    quantity      INTEGER NOT NULL,
    period        INTEGER NOT NULL,
    filled        BOOLEAN NOT NULL DEFAULT FALSE,
    pickedUp      BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY(productID) REFERENCES products(id),
    FOREIGN KEY(patientID) REFERENCES patients(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventory (
    id          INTEGER PRIMARY KEY NOT NULL,
    productID   INTEGER NOT NULL,
    expiration  TEXT NOT NULL,
    quantity    INTEGER NOT NULL CHECK (quantity >= 0),
    FOREIGN KEY(productID) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS logloglog (
    id            INTEGER PRIMARY KEY NOT NULL,
    time          TEXT NOT NULL,
    userID        INTEGER NOT NULL,
    action        INTEGER NOT NULL,
    FOREIGN KEY(userID) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS purchase_log (
    id             INTEGER PRIMARY KEY NOT NULL,
    time           TEXT NOT NULL,
    itemID         INTEGER NOT NULL,
    totalPrice     INTEGER NOT NULL,
    quantity       INTEGER NOT NULL,
    cartID         TEXT NOT NULL,
    FOREIGN KEY(itemID) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS inventory_log (
    id             INTEGER PRIMARY KEY NOT NULL,
    time           TEXT NOT NULL,
    productID      INTEGER NOT NULL,
    action         INTEGER NOT NULL,
    quantity       INTEGER NOT NULL,
    FOREIGN KEY(productID) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS products (
    id             INTEGER PRIMARY KEY NOT NULL,
    name           TEXT NOT NULL,
    type           INTEGER NOT NULL,
    price          INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS fill_log (
    id             INTEGER PRIMARY KEY NOT NULL,
    time           TEXT NOT NULL,
    prescriptionID INTEGER NOT NULL,
    userID         INTEGER NOT NULL,
    FOREIGN KEY(prescriptionID) REFERENCES prescriptions(id),
    FOREIGN KEY(userID) REFERENCES users(id)
);
