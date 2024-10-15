import type {PageServerLoad, Actions} from "./$types";
import {fillPrescription, getPrescription, loadPrescriptions} from "$lib/util";
import {fail} from "@sveltejs/kit";

export const load: PageServerLoad = async ({locals}) => {
    return {
        prescriptions: await loadPrescriptions(locals.db, false, true)
    };
};

export const actions: Actions = {
    fill: async ({request, locals}) => {
        const data = await request.formData();
        const prescriptionID = parseInt(data.get("prescriptionID") as string);
        console.log(`Filled prescription: ${prescriptionID}`);

        // Load prescription from db, don't pass it from the client.
        // Never trust client-side data.
        const p = await getPrescription(locals.db, prescriptionID);

        if (p === null) {
            return fail(404, {error: "Prescription not found"});
        }

        // TODO: Change to locals.user.id once auth/users is set up
        await fillPrescription(locals.db, p, 1);
    }
};
