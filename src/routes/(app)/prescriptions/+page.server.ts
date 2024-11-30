import {fail} from "@sveltejs/kit";
import type {PageServerLoad, Actions} from "./$types";
import {
    loadPrescriptions,
    loadPatients,
    loadProducts,
    insertPrescription,
    checkPatientID,
    checkProductID,
    checkAccess
} from "$lib/util";

//On loading of the page in the browser, this function is called and fetches all products, patients, and prescriptions
export const load: PageServerLoad = async ({locals}) => {
    checkAccess(locals.user?.type);
    const prescriptions = await loadPrescriptions(locals.db);
    const patients = await loadPatients(locals.db);
    const products = await loadProducts(locals.db);

    return {
        patients: patients,
        prescriptions: prescriptions,
        products: products
    };
};

//This function is the default called from and form submitted in the page.svelte. Its only use is to validate form inputs for an new prescriptions
export const actions: Actions = {
    default: async ({request, locals}) => {
        checkAccess(locals.user?.type);

        const data = await request.formData();
        const patientID = parseInt(data.get("patientID") as string);
        const productID = parseInt(data.get("productID") as string);
        const quantity = parseInt(data.get("quantity") as string);
        const period = parseInt(data.get("period") as string);

        const errors: {[key: string]: string} = {}; // Object to hold error messages

        // Validate patientId
        if (isNaN(patientID) || patientID <= 0) {
            errors.patientID = "Invalid or Missing Patient";
        } else {
            const patientIDValid = await checkPatientID(locals.db, patientID);
            if (!patientIDValid) {
                errors.patientID = "Patient ID not found or invalid";
            }
        }

        // Validate productId
        if (isNaN(productID) || productID <= 0) {
            errors.productID = "Invalid or Missing Product";
        } else {
            const productIDValid = await checkProductID(locals.db, productID);
            if (!productIDValid) {
                errors.productID = "Product ID not found or invalid";
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
            await insertPrescription(locals.db, {
                patientID,
                productID,
                quantity,
                period
            });
            return {success: "Prescription submitted successfully!"};
        }
    }
};
