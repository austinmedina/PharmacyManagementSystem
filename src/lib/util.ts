import type {D1Database} from "@cloudflare/workers-types";
import * as types from "./types";

export async function loadProducts(db: D1Database): Promise<types.Product[]> {
    return (await db.prepare("SELECT * FROM products").all<types.Product>())
        .results;
}

export async function loadPatients(db: D1Database): Promise<types.Patient[]> {
    return (await db.prepare("SELECT * FROM patients").all<types.Patient>())
        .results;
}

export async function insertPrescription(
    db: D1Database,
    p: Omit<types.MinimalPrescription, "id" | "filled">
): Promise<void> {
    await db
        .prepare(
            "INSERT INTO prescriptions (patientID, productID, quantity, period) VALUES (?, ?, ?, ?)"
        )
        .bind(p.patientID, p.productID, p.quantity, p.period)
        .run();
}

export async function insertPatient(
    db: D1Database,
    p: Omit<types.Patient, "id"> // Exclude id since it is auto-generated
): Promise<void> {
    await db
        .prepare(
            "INSERT INTO patients (firstName, lastName, dateOfBirth, email, phone, address, insurance) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(
            p.firstName,
            p.lastName,
            p.dateOfBirth.toISOString(),
            p.email,
            p.phone,
            p.address,
            p.insurance
        )
        .run();
}

export async function checkPatientID(
    db: D1Database,
    patientId: number
): Promise<boolean> {
    const result = await db
        .prepare("SELECT COUNT(*) as count FROM patients WHERE id = ?")
        .bind(patientId)
        .first<{count: number}>(); // Specify result is expected to have a 'count' property of type 'number'

    // Explicitly check if result is not null or undefined and check if count is greater than 0
    return result !== null && result !== undefined && result.count > 0;
}

export async function checkProductID(
    db: D1Database,
    productId: number
): Promise<boolean> {
    const result = await db
        .prepare("SELECT COUNT(*) as count FROM products WHERE id = ?")
        .bind(productId)
        .first<{count: number}>(); // Specify result is expected to have a 'count' property of type 'number'

    // Explicitly check if result is not null or undefined and check if count is greater than 0
    return result !== null && result !== undefined && result.count > 0;
}

export async function loadPrescriptions(
    db: D1Database,
    filled: boolean | undefined = undefined,
    checkInventory: boolean = false,
    pickedUp: boolean | undefined = undefined
): Promise<types.Prescription[]> {
    let query_string = `SELECT prescriptions.id as prescriptionID, prescriptions.*, products.*, patients.* from prescriptions\
                            INNER JOIN products ON prescriptions.productID = products.id\
                            INNER JOIN patients on prescriptions.patientID = patients.id`;

    // Joins inventory table and filters prescriptions based on whether we have the inventory to fill them.
    const join_inventory_string =
        " RIGHT JOIN inventory ON prescriptions.productID = inventory.productID";
    const check_inventory_string = ` GROUP BY prescriptions.id, inventory.productID\
                                        HAVING SUM(inventory.quantity) >= prescriptions.quantity`;
    const filled_string = " WHERE prescriptions.filled = ?";
    const pickedUp_string = "AND prescriptions.pickedUp = ?";

    let query;
    const bindings: boolean[] = [];

    if (typeof filled === "undefined") {
        // Get all prescriptions, regardless whether they are filled or not

        if (checkInventory) {
            query_string += join_inventory_string + check_inventory_string;
        }
        query = db.prepare(query_string);
    } else {
        // Get only prescriptions that are filled/not filled

        if (checkInventory) {
            query_string +=
                join_inventory_string +
                filled_string +
                (typeof pickedUp === "undefined" ? "" : pickedUp_string) +
                check_inventory_string;
        } else {
            query_string +=
                filled_string +
                (typeof pickedUp === "undefined" ? "" : pickedUp_string);
        }
        bindings.push(filled);
        if (typeof pickedUp !== "undefined") {
            bindings.push(pickedUp);
        }

        query = db.prepare(query_string).bind(...bindings);
    }
    return (await query.all()).results.map((row) => {
        return {
            id: row["prescriptionID"] as number,
            quantity: row["quantity"] as number,
            period: row["period"] as number,
            filled: row["filled"] as boolean,
            pickedUp: row["pickedUp"] as boolean,
            product: {
                id: row["productID"] as number,
                name: row["name"] as string,
                type: row["type"] as number as types.ProductType,
                price: row["price"] as number
            },
            patient: {
                id: row["patientID"] as number,
                firstName: row["firstName"] as string,
                lastName: row["lastName"] as string,
                dateOfBirth: new Date(row["dateOfBirth"] as string),
                email: row["email"] as string,
                phone: row["phone"] as string,
                address: row["address"] as string,
                insurance: row["insurance"] as boolean
            }
        };
    });
}

export async function getPrescription(
    db: D1Database,
    id: types.PrescriptionID
): Promise<types.Prescription | null> {
    const row = await db
        .prepare(
            `SELECT prescriptions.id as prescriptionID, prescriptions.*, products.*, patients.* from prescriptions\
                            INNER JOIN products ON prescriptions.productID = products.id\
                            INNER JOIN patients on prescriptions.patientID = patients.id\
                            WHERE prescriptionID = ?`
        )
        .bind(id)
        .first();

    if (row === null) {
        return null;
    }

    return {
        id: row["prescriptionID"] as number,
        quantity: row["quantity"] as number,
        period: row["period"] as number,
        filled: row["filled"] as boolean,
        pickedUp: row["filledUp"] as boolean,
        product: {
            id: row["productID"] as number,
            name: row["name"] as string,
            type: row["type"] as number as types.ProductType,
            price: row["price"] as number
        },
        patient: {
            id: row["patientID"] as number,
            firstName: row["firstName"] as string,
            lastName: row["lastName"] as string,
            dateOfBirth: new Date(row["dateOfBirth"] as string),
            email: row["email"] as string,
            phone: row["phone"] as string,
            address: row["address"] as string,
            insurance: row["insurance"] as boolean
        }
    };
}

export async function findInventory(
    db: D1Database,
    p: types.ProductID
): Promise<types.InventoryEntry[]> {
    return (
        await db
            .prepare(
                "SELECT * FROM inventory WHERE productID = ? ORDER BY expiration"
            )
            .bind(p)
            .all<types.InventoryEntry>()
    ).results.map((item) => {
        item.expiration = new Date(item.expiration);
        return item;
    });
}

export async function getAllInventory(db: D1Database) {
    const today = new Date();
    const soon = new Date();
    soon.setDate(soon.getDate() + 30);

    const result = await db
        .prepare(
            `
         SELECT 
         products.id, 
         products.name, 
         products.type, 
         products.price,
         COALESCE(SUM(inventory.quantity), 0) AS totalQuantity,
         COALESCE(SUM(CASE WHEN DATE(inventory.expiration) < DATE(?) THEN inventory.quantity ELSE 0 END), 0) AS numExpired,
         COALESCE(SUM(CASE WHEN DATE(inventory.expiration) < DATE(?) AND DATE(inventory.expiration) > DATE(?) THEN inventory.quantity ELSE 0 END), 0) AS numExpiringSoon
         FROM products
         LEFT JOIN inventory ON products.id = inventory.productID
         GROUP BY products.id
         ORDER BY numExpired DESC
         `
        )
        .bind(today.toISOString(), soon.toISOString(), today.toISOString())
        .all<types.CartEntry>();
    return result.results.map((product) => ({
        ...product,
        quantity: 0
    }));
}

export async function addInventory(
    db: D1Database,
    productID: number,
    expirationDate: string,
    quantity: number
) {
    db.prepare(
        `INSERT INTO inventory
      VALUES (null, ?, ?, ?)
      `
    )
        .bind(productID, expirationDate, quantity)
        .run();

    db.prepare(
        "INSERT INTO inventory_log (time, productID, action, quantity) VALUES (?, ?, ?, ?)"
    )
        .bind(
            new Date().toISOString(),
            productID,
            types.InventoryAction.In,
            quantity
        )
        .run();
}

export async function removeInventory(
    db: D1Database,
    product: types.ProductID,
    quantity: number
) {
    await db.batch(await removeInventoryStatements(db, product, quantity));
}

export async function removeInventoryStatements(
    db: D1Database,
    product: types.ProductID,
    quantity: number,
    expiresAfter: Date | null = null
): Promise<D1PreparedStatement[]> {
    // List of inventory we have for the product, already sorted by expiration date
    const inventory = await findInventory(db, product);

    const used_inventory = [];
    let needed_quantity = quantity;

    // Figuring out which/how many of our inventory batches we need to fill the order
    for (const i of inventory) {
        if (expiresAfter == null || expiresAfter > i.expiration) {
            if (i.quantity >= needed_quantity) {
                used_inventory.push({item: i, amount: needed_quantity});
                break;
            } else {
                used_inventory.push({item: i, amount: i.quantity});
                needed_quantity -= i.quantity;
            }
        }
    }

    // Creating a list of db statments to execute all in one transaction,
    //  so that if anything fails, or the inventory amount changed since
    //  we last checked, all of our db modifications get rolled back at
    //  once and we don't end up with our db in an invalid state.
    const statements = [
        db
            .prepare(
                "INSERT INTO inventory_log (time, productID, action, quantity) VALUES (?, ?, ?, ?)"
            )
            .bind(
                new Date().toISOString(),
                product,
                types.InventoryAction.Out,
                quantity
            )
    ];

    // Making reusable statments, because they could be reused in the loop.
    const delete_statement = db.prepare("DELETE FROM inventory WHERE id = ?");
    for (const i of used_inventory) {
        if (i.item.quantity == i.amount) {
            statements.push(delete_statement.bind(i.item.id));
        } else {
            // This branch will only be run once, so no reusable statment necessary.
            statements.push(
                db
                    .prepare("UPDATE inventory SET quantity = ? WHERE id = ?")
                    .bind(i.item.quantity - i.amount, i.item.id)
            );
        }
    }
    return statements;
}

export async function fillPrescription(
    db: D1Database,
    p: types.Prescription,
    user: types.UserID
): Promise<D1Result[]> {
    const statements = [
        db
            .prepare("UPDATE prescriptions SET filled = TRUE WHERE id = ?")
            .bind(p.id),

        db
            .prepare(
                "INSERT INTO fill_log (time, prescriptionID, userID) VALUES (?, ?, ?)"
            )
            .bind(new Date().toISOString(), p.id, user)
    ];
    statements.concat(
        await removeInventoryStatements(
            db,
            p.product.id,
            p.quantity,
            new Date()
        )
    );
    return await db.batch(statements);
}

export async function pickUpPrescription(
    db: D1Database,
    p: types.Prescription
) {
    await db
        .prepare("UPDATE prescriptions SET pickedUp = TRUE WHERE id = ?")
        .bind(p.id)
        .run();
}

export async function deletePatient(
    db: D1Database,
    patientId: number
): Promise<void> {
    await db.prepare("DELETE FROM patients WHERE id = ?").bind(patientId).run();
}

export async function loadUser_by_username(
    db: D1Database,
    username: string
): Promise<types.User | null> {
    const result = await db
        .prepare("SELECT * FROM users WHERE username = ? LIMIT 1;")
        .bind(username)
        .all();

    if (result.results.length > 0) {
        const user: types.User = result.results[0] as unknown as types.User;
        return user;
    }

    return null;
}
export async function updatePatient(
    db: D1Database,
    p: types.Patient
): Promise<void> {
    await db
        .prepare(
            "UPDATE patients SET firstName = ?, lastName = ?, dateOfBirth = ?, email = ?, phone = ?, insurance = ? WHERE id = ?"
        )
        .bind(
            p.firstName,
            p.lastName,
            p.dateOfBirth.toISOString(),
            p.email,
            p.phone,
            p.insurance,
            p.id // Assuming p has an id property
        )
        .run();
}

export async function deletePrescription(
    db: D1Database,
    prescriptionId: number
): Promise<void> {
    await db
        .prepare("DELETE FROM prescriptions WHERE id = ?")
        .bind(prescriptionId)
        .run();
}

export async function updatePrescription(
    db: D1Database,
    p: types.Prescription
): Promise<void> {
    await db
        .prepare(
            "UPDATE patients SET product = ?, patient = ?, quantity = ?, period = ?, filled = False WHERE id = ?"
        )
        .bind(
            p.product,
            p.patient,
            p.quantity,
            p.period,
            p.id // Assuming p has an id property
        )
        .run();
}

export async function loadUsers(db: D1Database): Promise<types.User[]> {
    const result = await db.prepare("SELECT * FROM users").all<types.User>();
    return result.results;
}

export async function insertUser(
    db: D1Database,
    user: Omit<types.User, "id">
): Promise<void> {
    await db
        .prepare(
            "INSERT INTO users (firstName, lastName, username, password, type) VALUES (?, ?, ?, ?, ?)"
        )
        .bind(
            user.firstName,
            user.lastName,
            user.username,
            user.password,
            user.type
        )
        .run();
}

export async function checkUsernameExists(
    db: D1Database,
    username: string
): Promise<boolean> {
    const result = await db
        .prepare("SELECT COUNT(*) as count FROM users WHERE username = ?")
        .bind(username)
        .first<{count: number}>();

    return result !== null && result !== undefined && result.count > 0;
}

export async function deleteUser(
    db: D1Database,
    userId: number
): Promise<void> {
    await db.prepare("DELETE FROM users WHERE id = ?").bind(userId).run();
}

export async function loadLogLogLogs(
    db: D1Database
): Promise<(types.LogLogLogEntry & {name: string; username: string})[]> {
    return (
        await db
            .prepare(
                "SELECT logloglog.*, users.firstName || ' ' || users.lastName AS name, users.username FROM logloglog JOIN users ON logloglog.userID = users.id;"
            )
            .all<types.LogLogLogEntry & {name: string; username: string}>()
    ).results.map((entry) => {
        entry.type = types.LogType.LogLog;
        entry.time = new Date(entry.time);
        return entry;
    });
}

export async function loadPurchaseLogs(
    db: D1Database
): Promise<(types.PurchaseLogEntry & {name: string})[]> {
    return (
        await db
            .prepare(
                "SELECT purchase_log.*, products.name FROM purchase_log JOIN products ON purchase_log.itemID = products.id;"
            )
            .all<types.PurchaseLogEntry & {name: string}>()
    ).results.map((entry) => {
        entry.type = types.LogType.Purchase;
        entry.time = new Date(entry.time);
        return entry;
    });
}

export async function loadInventoryLogs(
    db: D1Database
): Promise<(types.InventoryLogEntry & {name: string})[]> {
    return (
        await db
            .prepare(
                "SELECT inventory_log.*, products.name FROM inventory_log JOIN products ON inventory_log.productID = products.id;"
            )
            .all<types.InventoryLogEntry & {name: string}>()
    ).results.map((entry) => {
        entry.type = types.LogType.Inventory;
        entry.time = new Date(entry.time);
        return entry;
    });
}

export async function loadFillLogs(db: D1Database): Promise<
    (types.FillLogEntry & {
        name: string;
        username: string;
        patientID: number;
        patient: string;
    })[]
> {
    return (
        await db
            .prepare(
                "SELECT fill_log.*, users.firstName || ' ' || users.lastName as name, users.username, prescriptions.patientID, patients.firstName || ' ' || patients.lastName as patient FROM fill_log JOIN users ON fill_log.userID = users.id JOIN prescriptions on fill_log.prescriptionID = prescriptions.id JOIN patients on prescriptions.patientID = patients.id"
            )
            .all<
                types.FillLogEntry & {
                    name: string;
                    username: string;
                    patientID: number;
                    patient: string;
                }
            >()
    ).results.map((entry) => {
        entry.type = types.LogType.Fill;
        entry.time = new Date(entry.time);
        return entry;
    });
}

export async function logLogLogLog(
    db: D1Database,
    time: string,
    username: string,
    action: number
) {
    await db
        .prepare(
            `INSERT INTO logloglog
        (time, userID, action)
        VALUES (?, ?, ?)`
        )
        .bind(time, username, action)
        .run();
}

export async function logPurchase(
    db: D1Database,
    time: string,
    productID: number,
    totalPrice: number,
    quantity: number,
    cartID: string
) {
    await db
        .prepare(
            `INSERT INTO purchase_log
        (time, itemID, totalPrice, quantity, cartID)
        VALUES (?, ?, ?, ?, ?)`
        )
        .bind(time, productID, totalPrice, quantity, cartID)
        .run();
}

export async function loadInventoryReport(
    db: D1Database
): Promise<types.InventoryLogEntry[]> {
    const result = await db
        .prepare("SELECT * FROM inventory_log")
        .all<types.InventoryLogEntry>();
    return result.results;
}

export async function loadFinancialReport(
    db: D1Database
): Promise<types.PurchaseLogEntry[]> {
    const result = await db
        .prepare("SELECT * FROM purchase_log")
        .all<types.PurchaseLogEntry>();
    return result.results;
}

export async function addProduct(
    db: D1Database,
    name: string,
    price: number,
    type: types.ProductType
) {
    db.prepare(
        `INSERT INTO products
      VALUES (null, ?, ?, ?)
      `
    )
        .bind(name, price, type)
        .run();
}
