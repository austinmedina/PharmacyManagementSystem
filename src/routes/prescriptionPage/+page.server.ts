import type { PageServerLoad, Actions } from './$types'
import { loadProducts, loadPatients, insertPrescription } from '$lib/util'

export const load: PageServerLoad = async ({ platform }) => {
    let products = await loadProducts(platform?.env.DB as unknown as D1Database);
	let patients = await loadPatients(platform?.env.DB as unknown as D1Database);
    
	return {
		patients:patients,
		products:products
    }
}

export const actions: Actions = {
	default: async ({ request, platform }) => {
		console.log("IN SUBMIT");
		const data = await request.formData();
		const patientId = data.get('patientID');
		const productId = data.get('productID');
		const quantity = data.get('quantity');
		const period = data.get('period');

		const errors: { [key: string]: string } = {}; // Object to hold error messages

        // Validate patientId
        if (!patientId || typeof patientId !== 'string') {
            errors.patientID = 'Invalid or Missing Patient';
        }

        // Validate productId
        if (!productId || typeof productId !== 'string') {
            errors.productID = 'Invalid or Missing Product';
        }

        // Validate quantity
        const quantityParsed = parseInt(quantity as string);
        if (isNaN(quantityParsed) || quantityParsed <= 0) {
            errors.quantity = 'Invalid or Missing Quantity';
        }

        // Validate period
        const periodParsed = parseInt(period as string);
        if (isNaN(periodParsed) || periodParsed <= 0) {
            errors.period = 'Invalid or Missing Period';
        }

        if (Object.keys(errors).length > 0) {
            return { errors }; // Return all errors if any exist
        }
		else {
			await insertPrescription(platform?.env.DB as unknown as D1Database, {
				patientId,
				productId,
				quantity: parseInt(quantity as string),
				period: parseInt(period as string)
			});
	
			// const prescriptions = await platform?.env.DB.prepare("SELECT * FROM prescriptions").all();
			// console.log(prescriptions);
			return { success: 'Prescription submitted successfully!' };
		}
	}
};
