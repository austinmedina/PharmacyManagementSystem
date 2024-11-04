-- Migration number: 0002 	 2024-10-13T09:56:21.839Z
DELETE FROM logloglog;
DELETE FROM purchase_log;
DELETE FROM inventory_log;
DELETE FROM fill_log;
DELETE FROM inventory;
DELETE FROM prescriptions;
DELETE FROM patients;
DELETE FROM products;
DELETE FROM users;

INSERT INTO patients VALUES (null, "John", "Doe", "1983-08-05T00:00:00-07:00", "jdoe@gmail.com", "1111111111", TRUE);
INSERT INTO patients VALUES (null, "Jane", "Doe", "1982-04-05T00:00:00-07:00", "jadoe@gmail.com", "1111111111", FALSE);
INSERT INTO patients VALUES (null, "John", "Smith", "1990-01-15T00:00:00-07:00", "johnsmith@gmail.com", "2222222222", FALSE);
INSERT INTO patients VALUES (null, "Emily", "Johnson", "1985-03-22T00:00:00-07:00", "emilyj@gmail.com", "3333333333", TRUE);
INSERT INTO patients VALUES (null, "Michael", "Brown", "1975-12-30T00:00:00-07:00", "michaelb@gmail.com", "4444444444", FALSE);
INSERT INTO patients VALUES (null, "Sarah", "Davis", "1995-06-10T00:00:00-07:00", "sarahd@gmail.com", "5555555555", TRUE);
INSERT INTO patients VALUES (null, "David", "Wilson", "1980-07-20T00:00:00-07:00", "davidw@gmail.com", "6666666666", FALSE);
INSERT INTO patients VALUES (null, "Laura", "Taylor", "1992-11-05T00:00:00-07:00", "laurat@gmail.com", "7777777777", TRUE);
INSERT INTO patients VALUES (null, "James", "Anderson", "1988-09-25T00:00:00-07:00", "jamesa@gmail.com", "8888888888", FALSE);
INSERT INTO patients VALUES (null, "Linda", "Thomas", "1993-02-14T00:00:00-07:00", "lindat@gmail.com", "9999999999", TRUE);
INSERT INTO patients VALUES (null, "Robert", "Moore", "1987-10-30T00:00:00-07:00", "robertm@gmail.com", "1010101010", FALSE);
INSERT INTO patients VALUES (null, "Patricia", "Jackson", "1991-05-17T00:00:00-07:00", "patriciaj@gmail.com", "2020202020", TRUE);


INSERT INTO products VALUES (null, "Advil", 1, 530);
INSERT INTO products VALUES (null, "Band-Aid", 1, 1320);
INSERT INTO products VALUES (null, "Aderall", 0, 5000);
INSERT INTO products VALUES (null, "Tylenol", 1, 699);
INSERT INTO products VALUES (null, "Melatonin", 1, 999);
INSERT INTO products VALUES (null, "Oxycodone", 0, 12099);

INSERT INTO prescriptions VALUES (null, 1, 1, 4, 2, FALSE, FALSE);
INSERT INTO prescriptions VALUES (null, 2, 2, 1, 6, FALSE, FALSE);
INSERT INTO prescriptions VALUES (null, 3, 2, 15, 6, TRUE, FALSE);
INSERT INTO prescriptions VALUES (null, 6, 4, 12, 6, TRUE, FALSE);

INSERT INTO inventory VALUES (null, 1, "2024-10-21T00:00:00-07:00", 4);
INSERT INTO inventory VALUES (null, 2, "2024-10-21T00:00:00-07:00", 9);

INSERT INTO users VALUES ("user1", "Who", "Cares1", "manager", "$argon2id$v=19$m=16,t=2,p=1$bWRGWEpaRkZGNkxjYjFxTw$dLRD+33vQmUnxn2m09+bjw",  0, FALSE, 0);
INSERT INTO users VALUES ("user2", "Who", "Cares2", "pharmacist", "$argon2id$v=19$m=16,t=2,p=1$SUtFUVlHSE9pMm9WcDFKcQ$+Ctfy5R+I2zsQAAfToEGxA",  1, FALSE, 0);
INSERT INTO users VALUES ("user3", "Who", "Cares3", "cashier", "$argon2id$v=19$m=16,t=2,p=1$aUJUUnNQT0pZTm5mcm8zVw$NH8RllIow31dmmXCmzlpBQ",  2, FALSE, 0);
INSERT INTO users VALUES ("user4", "Who", "Cares4", "technician", "$argon2id$v=19$m=16,t=2,p=1$ZDlZNXRCTGFpSHNEczFpcw$tzqarahAEidtLa6hqVfzIg",  3, FALSE, 0);

INSERT INTO inventory VALUES (null, 3, "2024-10-21T00:00:00-07:00", 14);
INSERT INTO inventory VALUES (null, 4, "2024-10-21T00:00:00-07:00", 20);
INSERT INTO inventory VALUES (null, 5, "2024-10-21T00:00:00-07:00", 32);
INSERT INTO inventory VALUES (null, 6, "2024-10-21T00:00:00-07:00", 5);
