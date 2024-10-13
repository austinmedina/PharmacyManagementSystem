import {fail} from "@sveltejs/kit";
import type {PageServerLoad, Actions} from "./$types";
import {loadProducts, loadPatients, insertPrescription, checkPatientID, checkProductID} from "$lib/util";

export const load: PageServerLoad = async ({platform}) => {
    const products = await loadProducts(
        platform?.env.DB as unknown as D1Database
    );
    const patients = await loadPatients(
        platform?.env.DB as unknown as D1Database
    );

    return {
        patients: patients,
        products: products
    };
};

export const actions: Actions = {
    default: async ({request, platform}) => {
        const data = await request.formData();
        console.log(data);
        const patientID = parseInt(data.get("patientID") as string);
        const productID = parseInt(data.get("productID") as string);
        const quantity = parseInt(data.get("quantity") as string);
        const period = parseInt(data.get("period") as string);

        const errors: {[key: string]: string} = {}; // Object to hold error messages

        // Validate patientId
        if (isNaN(patientID) || patientID <= 0) {
            console.log(typeof patientID);
            errors.patientID = 'Invalid or Missing Patient';
        } else {
            const patientIDValid = await checkPatientID(platform?.env.DB as unknown as D1Database, patientID);
            console.log("Made is to patientCheck");
            if (!patientIDValid) {
                errors.patientID = 'Patient ID not found or invalid';
            }
        }

        // Validate productId
        if (isNaN(productID) || productID <= 0) {
            errors.productID = 'Invalid or Missing Product';
        } else {
            const productIDValid = await checkProductID(platform?.env.DB as unknown as D1Database, productID);
            if (!productIDValid) {
                errors.productID = 'Product ID not found or invalid';
            }
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
            console.log("made it to insert");
            await insertPrescription(
                platform?.env.DB as unknown as D1Database,
                {
                    patientID,
                    productID,
                    quantity,
                    period
                }
            );
            console.log("Made it to end");
            // const prescriptions = await platform?.env.DB.prepare("SELECT * FROM prescriptions").all();
            // console.log(prescriptions);
            return {success: "Prescription submitted successfully!"};
        }
    }
};
