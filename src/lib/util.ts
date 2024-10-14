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
    checkInventory: boolean = false
): Promise<types.Prescription[]> {
    let query_string = `SELECT prescriptions.id as prescriptionID, prescriptions.*, products.*, patients.* from prescriptions\
                            INNER JOIN products ON prescriptions.productID = products.id\
                            INNER JOIN patients on prescriptions.patientID = patients.id`;

    // Joins inventory table and filters prescriptions based on whether we have the inventory to fill them.
    const join_inventory_string =
        " RIGHT JOIN inventory ON prescriptions.productID = inventory.productID";
    const check_inventory_string = ` GROUP BY prescriptions.id, inventory.productID\
                                        HAVING SUM(inventory.quantity) >= prescriptions.quantity`;
    let query;

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
                " WHERE prescriptions.filled = ?" +
                check_inventory_string;
        }
        query = db.prepare(query_string).bind(filled);
    }
    return (await query.all()).results.map((row) => {
        return {
            id: row["prescriptionID"] as number,
            quantity: row["quantity"] as number,
            period: row["period"] as number,
            filled: row["filled"] as boolean,
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
                insurance: row["insurance"] as boolean
            }
        };
    });
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
    ).results;
}
