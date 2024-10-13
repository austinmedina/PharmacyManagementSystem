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
    p: Omit<types.MinimalPrescription, "id">
): Promise<void> {
    await db
        .prepare(
            "INSERT INTO prescriptions (patient_id, product_id, quantity, period) VALUES (?, ?, ?, ?)"
        )
        .bind(p.patientID, p.productID, p.quantity, p.period)
        .run();
}

export async function checkPatientID(
    db: D1Database,
    patientId: number
): Promise<boolean> {
    const result = await db
        .prepare("SELECT COUNT(*) as count FROM Patients WHERE patientId = ?")
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
        .prepare("SELECT COUNT(*) as count FROM Products WHERE productId = ?")
        .bind(productId)
        .first<{count: number}>(); // Specify result is expected to have a 'count' property of type 'number'

    // Explicitly check if result is not null or undefined and check if count is greater than 0
    return result !== null && result !== undefined && result.count > 0;
}

export async function loadPrescriptions(
    db: D1Database,
    filled: boolean | undefined = undefined
): Promise<types.Prescription[]> {
    let query;
    if (typeof filled === "undefined") {
        // Get all prescriptions, regardless whether they are filled or not
        query =
            db.prepare(`SELECT prescription.id as prescription_id, prescriptions.*, products.*, patients.* from prescriptions\
                    INNER JOIN products ON prescriptions.product_id = products.id\
                    INNER JOIN patients on prescriptions.patient_id = patients.id`);
    } else {
        // Get only prescriptions that are filled/not filled
        query = db
            .prepare(
                `SELECT prescriptions.id as prescription_id, prescriptions.*, products.*, patients.* from prescriptions\
                    INNER JOIN products ON prescriptions.product_id = products.id\
                    INNER JOIN patients on prescriptions.patient_id = patients.id\
                    WHERE prescriptions.filled = ?`
            )
            .bind(filled);
    }
    return (await query.all()).results.map((row) => {
        return {
            id: row["prescription_id"] as number,
            quantity: row["quantity"] as number,
            period: row["period"] as number,
            filled: row["filled"] as boolean,
            product: {
                id: row["product_id"] as number,
                name: row["name"] as string,
                type: row["type"] as number as types.ProductType,
                price: row["price"] as number
            },
            patient: {
                id: row["patient_id"] as number,
                firstName: row["first_name"] as string,
                lastName: row["last_name"] as string,
                dateOfBirth: new Date(row["date_of_birth"] as string),
                email: row["email"] as string,
                phone: row["phone"] as string,
                insurance: row["insurance"] as boolean
            }
        };
    });
}
