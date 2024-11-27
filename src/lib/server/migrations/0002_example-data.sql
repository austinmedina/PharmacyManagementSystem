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

INSERT INTO patients VALUES (null, "John", "Doe", "1983-08-05T00:00:00-07:00", "jdoe@gmail.com", "1111111111", "123 Main St, Springfield, IL, 62701", TRUE);
INSERT INTO patients VALUES (null, "Jane", "Doe", "1982-04-05T00:00:00-07:00", "jadoe@gmail.com", "1111111111", "456 Oak St, Springfield, IL, 62702", FALSE);
INSERT INTO patients VALUES (null, "John", "Smith", "1990-01-15T00:00:00-07:00", "johnsmith@gmail.com", "2222222222", "789 Maple Ave, Springfield, IL, 62703", FALSE);
INSERT INTO patients VALUES (null, "Emily", "Johnson", "1985-03-22T00:00:00-07:00", "emilyj@gmail.com", "3333333333", "101 Pine Ln, Springfield, IL, 62704", TRUE);
INSERT INTO patients VALUES (null, "Michael", "Brown", "1975-12-30T00:00:00-07:00", "michaelb@gmail.com", "4444444444", "202 Birch Rd, Springfield, IL, 62705", FALSE);
INSERT INTO patients VALUES (null, "Sarah", "Davis", "1995-06-10T00:00:00-07:00", "sarahd@gmail.com", "5555555555", "303 Cedar St, Springfield, IL, 62706", TRUE);
INSERT INTO patients VALUES (null, "David", "Wilson", "1980-07-20T00:00:00-07:00", "davidw@gmail.com", "6666666666", "404 Walnut Ave, Springfield, IL, 62707", FALSE);
INSERT INTO patients VALUES (null, "Laura", "Taylor", "1992-11-05T00:00:00-07:00", "laurat@gmail.com", "7777777777", "505 Elm Dr, Springfield, IL, 62708", TRUE);
INSERT INTO patients VALUES (null, "James", "Anderson", "1988-09-25T00:00:00-07:00", "jamesa@gmail.com", "8888888888", "606 Chestnut Blvd, Springfield, IL, 62709", FALSE);
INSERT INTO patients VALUES (null, "Linda", "Thomas", "1993-02-14T00:00:00-07:00", "lindat@gmail.com", "9999999999", "707 Willow Pl, Springfield, IL, 62710", TRUE);
INSERT INTO patients VALUES (null, "Robert", "Moore", "1987-10-30T00:00:00-07:00", "robertm@gmail.com", "1010101010", "808 Aspen Ct, Springfield, IL, 62711", FALSE);
INSERT INTO patients VALUES (null, "Patricia", "Jackson", "1991-05-17T00:00:00-07:00", "patriciaj@gmail.com", "2020202020", "909 Redwood St, Springfield, IL, 62712", TRUE);

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

INSERT INTO users VALUES ("user1", "Who", "Cares1", "manager", "$argon2id$v=19$m=16,t=2,p=1$bWRGWEpaRkZGNkxjYjFxTw$dLRD+33vQmUnxn2m09+bjw",  0, FALSE, 0, FALSE);
INSERT INTO users VALUES ("user2", "Who", "Cares2", "pharmacist", "$argon2id$v=19$m=16,t=2,p=1$SUtFUVlHSE9pMm9WcDFKcQ$+Ctfy5R+I2zsQAAfToEGxA",  1, FALSE, 0, FALSE);
INSERT INTO users VALUES ("user3", "Who", "Cares3", "cashier", "$argon2id$v=19$m=16,t=2,p=1$aUJUUnNQT0pZTm5mcm8zVw$NH8RllIow31dmmXCmzlpBQ",  2, FALSE, 0, FALSE);
INSERT INTO users VALUES ("user4", "Who", "Cares4", "technician", "$argon2id$v=19$m=16,t=2,p=1$ZDlZNXRCTGFpSHNEczFpcw$tzqarahAEidtLa6hqVfzIg",  3, FALSE, 0, FALSE);

INSERT INTO inventory VALUES (null, 3, "2024-10-21T00:00:00-07:00", 14);
INSERT INTO inventory VALUES (null, 4, "2024-10-21T00:00:00-07:00", 20);
INSERT INTO inventory VALUES (null, 5, "2024-10-21T00:00:00-07:00", 32);
INSERT INTO inventory VALUES (null, 6, "2024-10-21T00:00:00-07:00", 5);

INSERT INTO purchase_log VALUES (null, "2024-11-01T09:00:00-07:00", 1, 530, 1, "cart101");
INSERT INTO purchase_log VALUES (null, "2024-11-01T09:00:00-07:00", 2, 2640, 2, "cart101");
INSERT INTO purchase_log VALUES (null, "2024-11-01T09:30:00-07:00", 3, 5000, 1, "cart102");
INSERT INTO purchase_log VALUES (null, "2024-11-02T11:15:00-07:00", 4, 1398, 2, "cart103");
INSERT INTO purchase_log VALUES (null, "2024-11-02T11:15:00-07:00", 5, 1998, 2, "cart103");
INSERT INTO purchase_log VALUES (null, "2024-11-03T14:30:00-07:00", 6, 12099, 1, "cart104");
INSERT INTO purchase_log VALUES (null, "2024-11-04T10:00:00-07:00", 1, 530, 1, "cart105");
INSERT INTO purchase_log VALUES (null, "2024-11-04T10:00:00-07:00", 3, 10000, 2, "cart105");
INSERT INTO purchase_log VALUES (null, "2024-11-04T10:00:00-07:00", 5, 999, 1, "cart105");
INSERT INTO purchase_log VALUES (null, "2024-11-05T09:45:00-07:00", 4, 2097, 3, "cart106");
INSERT INTO purchase_log VALUES (null, "2024-11-06T08:15:00-07:00", 2, 1320, 1, "cart107");
INSERT INTO purchase_log VALUES (null, "2024-11-06T08:15:00-07:00", 6, 24198, 2, "cart107");
INSERT INTO purchase_log VALUES (null, "2024-11-07T12:30:00-07:00", 5, 9990, 10, "cart108");
INSERT INTO purchase_log VALUES (null, "2024-11-08T16:45:00-07:00", 1, 2650, 5, "cart109");
INSERT INTO purchase_log VALUES (null, "2024-11-08T16:45:00-07:00", 2, 13200, 10, "cart109");
INSERT INTO purchase_log VALUES (null, "2024-11-09T09:15:00-07:00", 6, 12099, 1, "cart110");
INSERT INTO purchase_log VALUES (null, "2024-11-09T09:15:00-07:00", 3, 25000, 5, "cart110");
INSERT INTO purchase_log VALUES (null, "2024-11-10T13:20:00-07:00", 4, 1398, 2, "cart111");
INSERT INTO purchase_log VALUES (null, "2024-11-10T13:20:00-07:00", 1, 1060, 2, "cart111");
INSERT INTO purchase_log VALUES (null, "2024-11-10T13:20:00-07:00", 2, 3960, 3, "cart111");
INSERT INTO purchase_log VALUES (null, "2024-11-11T09:30:00-07:00", 1, 1060, 2, "cart112");
INSERT INTO purchase_log VALUES (null, "2024-11-11T10:00:00-07:00", 2, 5280, 4, "cart112");
INSERT INTO purchase_log VALUES (null, "2024-11-12T13:45:00-07:00", 3, 15000, 3, "cart113");
INSERT INTO purchase_log VALUES (null, "2024-11-12T15:00:00-07:00", 4, 699, 1, "cart114");
INSERT INTO purchase_log VALUES (null, "2024-11-13T09:00:00-07:00", 5, 2497, 2, "cart115");
INSERT INTO purchase_log VALUES (null, "2024-11-13T11:30:00-07:00", 6, 36297, 3, "cart115");
INSERT INTO purchase_log VALUES (null, "2024-11-14T10:45:00-07:00", 1, 1590, 3, "cart116");
INSERT INTO purchase_log VALUES (null, "2024-11-14T12:20:00-07:00", 3, 7500, 1, "cart116");
INSERT INTO purchase_log VALUES (null, "2024-11-14T14:00:00-07:00", 2, 6600, 5, "cart117");
INSERT INTO purchase_log VALUES (null, "2024-11-15T08:00:00-07:00", 4, 2097, 3, "cart118");
INSERT INTO purchase_log VALUES (null, "2024-11-15T09:15:00-07:00", 6, 36297, 3, "cart118");
INSERT INTO purchase_log VALUES (null, "2024-11-16T12:10:00-07:00", 5, 999, 1, "cart119");
INSERT INTO purchase_log VALUES (null, "2024-11-16T14:45:00-07:00", 1, 2650, 5, "cart120");
INSERT INTO purchase_log VALUES (null, "2024-11-16T16:20:00-07:00", 3, 12500, 5, "cart121");
INSERT INTO purchase_log VALUES (null, "2024-11-17T10:00:00-07:00", 2, 3300, 3, "cart122");


INSERT INTO inventory_log VALUES (null, "2024-11-01T08:00:00-07:00", 1, 1, 10);
INSERT INTO inventory_log VALUES (null, "2024-11-01T10:30:00-07:00", 2, 1, 5);
INSERT INTO inventory_log VALUES (null, "2024-11-01T14:15:00-07:00", 6, 0, 2);
INSERT INTO inventory_log VALUES (null, "2024-11-02T09:00:00-07:00", 3, 1, 8);
INSERT INTO inventory_log VALUES (null, "2024-11-02T13:00:00-07:00", 4, 0, 4);
INSERT INTO inventory_log VALUES (null, "2024-11-03T08:45:00-07:00", 5, 1, 12);
INSERT INTO inventory_log VALUES (null, "2024-11-03T16:20:00-07:00", 2, 0, 7);
INSERT INTO inventory_log VALUES (null, "2024-11-04T10:30:00-07:00", 6, 1, 3);
INSERT INTO inventory_log VALUES (null, "2024-11-04T14:00:00-07:00", 1, 0, 5);
INSERT INTO inventory_log VALUES (null, "2024-11-05T09:15:00-07:00", 4, 1, 6);
INSERT INTO inventory_log VALUES (null, "2024-11-05T17:45:00-07:00", 5, 0, 4);
INSERT INTO inventory_log VALUES (null, "2024-11-06T08:30:00-07:00", 3, 1, 15);
INSERT INTO inventory_log VALUES (null, "2024-11-06T12:10:00-07:00", 2, 0, 3);
INSERT INTO inventory_log VALUES (null, "2024-11-07T11:00:00-07:00", 1, 1, 20);
INSERT INTO inventory_log VALUES (null, "2024-11-07T15:30:00-07:00", 4, 0, 10);
INSERT INTO inventory_log VALUES (null, "2024-11-08T10:20:00-07:00", 5, 1, 8);
INSERT INTO inventory_log VALUES (null, "2024-11-08T14:00:00-07:00", 6, 0, 1);
INSERT INTO inventory_log VALUES (null, "2024-11-09T09:45:00-07:00", 2, 1, 10);
INSERT INTO inventory_log VALUES (null, "2024-11-09T16:10:00-07:00", 1, 0, 12);
INSERT INTO inventory_log VALUES (null, "2024-11-10T14:00:00-07:00", 4, 1, 5);
INSERT INTO inventory_log VALUES (null, "2024-11-11T08:00:00-07:00", 1, 1, 5);
INSERT INTO inventory_log VALUES (null, "2024-11-11T10:30:00-07:00", 2, 0, 8);
INSERT INTO inventory_log VALUES (null, "2024-11-12T09:00:00-07:00", 3, 1, 6);
INSERT INTO inventory_log VALUES (null, "2024-11-12T11:15:00-07:00", 4, 1, 4);
INSERT INTO inventory_log VALUES (null, "2024-11-13T13:00:00-07:00", 5, 0, 3);
INSERT INTO inventory_log VALUES (null, "2024-11-13T15:45:00-07:00", 6, 1, 2);
INSERT INTO inventory_log VALUES (null, "2024-11-14T08:30:00-07:00", 1, 1, 10);
INSERT INTO inventory_log VALUES (null, "2024-11-14T12:00:00-07:00", 2, 0, 7);
INSERT INTO inventory_log VALUES (null, "2024-11-15T09:00:00-07:00", 3, 1, 9);
INSERT INTO inventory_log VALUES (null, "2024-11-15T10:45:00-07:00", 4, 0, 5);
INSERT INTO inventory_log VALUES (null, "2024-11-16T14:15:00-07:00", 5, 1, 8);
INSERT INTO inventory_log VALUES (null, "2024-11-16T16:30:00-07:00", 6, 0, 4);
INSERT INTO inventory_log VALUES (null, "2024-11-17T09:00:00-07:00", 1, 1, 12);
INSERT INTO inventory_log VALUES (null, "2024-11-17T11:30:00-07:00", 2, 0, 6);
INSERT INTO inventory_log VALUES (null, "2024-11-17T14:00:00-07:00", 3, 1, 10);

INSERT INTO logloglog VALUES (null, "2024-10-21T00:00:00-07:00", "user1", 0);
INSERT INTO logloglog VALUES (null, "2024-10-21T00:50:00-07:00", "user1", 1);

INSERT INTO fill_log VALUES (null, "2024-10-21T00:00:00-07:00", 2, "user2");
