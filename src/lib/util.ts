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
   const result = await db.prepare("SELECT * FROM Patients WHERE patient = ?")
                          .bind(patientId)
                          .run();
   return result.results.length > 0; // Changed to > 0, because you're checking if any record exists
}

export async function checkProductID(db: D1Database, productId: number): Promise<boolean> {
   const result = await db.prepare("SELECT * FROM Products WHERE product = ?")
                          .bind(productId)
                          .run();
   return result.results.length > 0; // Changed to > 0 for the same reason
}
