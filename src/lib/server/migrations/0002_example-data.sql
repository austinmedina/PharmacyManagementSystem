-- Migration number: 0002 	 2024-10-13T09:56:21.839Z

DELETE FROM logloglog;
DELETE FROM purchase_log;
DELETE FROM inventory_log;
DELETE FROM fill_log;
DELETE FROM inventory;
DELETE FROM prescriptions;
DELETE FROM patients;
DELETE FROM products;


INSERT INTO patients VALUES (null, "John", "Doe", "1983-08-05T00:00:00-07:00", "jdoe@gmail.com", "1111111111", TRUE);
INSERT INTO patients VALUES (null, "Jane", "Doe", "1982-04-05T00:00:00-07:00", "jadoe@gmail.com", "1111111111", FALSE);

INSERT INTO products VALUES (null, "Advil", 1, 530);
INSERT INTO products VALUES (null, "Band-Aid", 1, 1320);
INSERT INTO products VALUES (null, "Aderall", 0, 5000);

INSERT INTO prescriptions VALUES (null, 1, 1, 4, 2, FALSE);
INSERT INTO prescriptions VALUES (null, 2, 2, 1, 6, FALSE);
INSERT INTO prescriptions VALUES (null, 1, 2, 5, 6, FALSE);

INSERT INTO inventory VALUES (null, 1, "2024-10-21T00:00:00-07:00", 4);
INSERT INTO inventory VALUES (null, 2, "2024-10-21T00:00:00-07:00", 9);
