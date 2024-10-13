import { fail } from '@sveltejs/kit';
import type {PageServerLoad, Actions} from "./$types";
import {loadProducts, loadPatients, insertPrescription} from "$lib/util";

export const load: PageServerLoad = async ({platform}) => {
    let products = await loadProducts(
        platform?.env.DB as unknown as D1Database
    );
    let patients = await loadPatients(
        platform?.env.DB as unknown as D1Database
    );

    return {
        patients: patients,
        products: products
    };
};

export const actions: Actions = {
    default: async ({request, platform}) => {
        // console.log("IN SUBMIT");
        const data = await request.formData();
        const patientID = parseInt(data.get("patientID") as string);
        const productID = parseInt(data.get("productID") as string);
        const quantity = parseInt(data.get("quantity") as string);
        const period = parseInt(data.get("period") as string);

        const errors: {[key: string]: string} = {}; // Object to hold error messages

        // Validate patientID
        if (isNaN(patientID)|| typeof patientID !== "number") {
            errors.patientID = "Invalid or Missing Patient";
        }

        // Validate productID
        if (isNaN(productID) || typeof productID !== "number") {
            errors.productID = "Invalid or Missing Product";
        }

        // Validate quantity
        if (isNaN(quantity) || quantity <= 0) {
            errors.quantity = "Invalid or Missing Quantity";
        }

        // Validate period
        if (isNaN(period) || period <= 0) {
            errors.period = "Invalid or Missing Period";
        }

        if (Object.keys(errors).length > 0) {
            return fail(400, {errors}); // Return all errors if any exist
        } else {
            await insertPrescription(
                platform?.env.DB as unknown as D1Database,
                {
                    patientID,
                    productID,
                    quantity,
                    period
                }
            );

            // const prescriptions = await platform?.env.DB.prepare("SELECT * FROM prescriptions").all();
            // console.log(prescriptions);
            return {success: "Prescription submitted successfully!"};
        }
    }
};
