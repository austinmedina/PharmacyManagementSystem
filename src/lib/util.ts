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
    p: Omit<types.Prescription, "id">
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
