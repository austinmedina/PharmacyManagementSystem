import type {D1Database} from "@cloudflare/workers-types";
import * as types from "./types";

export async function loadProducts(db: D1Database): Promise<types.Product[]> {
    return (await db.prepare("SELECT * FROM products").all<types.Product>())
        .results;
}

export async function loadPatients(db: D1Database): Promise<types.Patient[]> {
   return (await db.prepare("SELECT * FROM patients").run()).results.map((patient) => {
      if (typeof patient['dateOfBirth'] === 'string') {
         patient['dateOfBirth'] = new Date(patient['dateOfBirth']);
      }
      return patient as types.Patient;
   });
}

export async function insertPrescription(db: D1Database, { patientId, productId, quantity, period }): Promise<void> {
   await db.prepare("INSERT INTO prescriptions (patientId, productId, quantity, period) VALUES (?, ?, ?, ?)")
      .bind(patientId, productId, quantity, period)
      .run();
}

