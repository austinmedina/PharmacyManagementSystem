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
            "INSERT INTO prescriptions (patient, product, quantity, period) VALUES (?, ?, ?, ?)"
        )
        .bind(p.patientID, p.productID, p.quantity, p.period)
        .run();
}

export async function checkPatientID(db: D1Database, patientId: number): Promise<boolean> {
   const result = await db.prepare("SELECT COUNT(*) as count FROM Patients WHERE patientId = ?")
                          .bind(patientId)
                          .first(); // Use .first() to get the first row of the result
   return result.count > 0; // Check if count is greater than 0
}


export async function checkProductID(db: D1Database, productId: number): Promise<boolean> {
   const result = await db.prepare("SELECT COUNT(*) as count FROM Products WHERE product = ?")
                          .bind(productId)
                          .first();
   return result.count > 0; // Changed to > 0 for the same reason
}
