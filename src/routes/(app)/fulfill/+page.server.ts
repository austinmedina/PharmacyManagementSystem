import type {PageServerLoad, Actions} from "./$types";
import {
    checkAccess,
    fillPrescription,
    getPrescription,
    loadPrescriptions
} from "$lib/util";
import {fail} from "@sveltejs/kit";
import {UserType} from "$lib/types";

export const load: PageServerLoad = async ({locals}) => {
    console.log(locals.user?.type);
    checkAccess(locals.user?.type, [UserType.Pharmacist]);
    return {
        prescriptions: await loadPrescriptions(locals.db, false, true)
    };
};

export const actions: Actions = {
    fill: async ({request, locals}) => {
        checkAccess(locals.user?.type, [UserType.Pharmacist]);
        const data = await request.formData();
        const prescriptionID = parseInt(data.get("prescriptionID") as string);
        // console.log(`Filled prescription: ${prescriptionID}`);

        // Load prescription from db, don't pass it from the client.
        // Never trust client-side data.
        const p = await getPrescription(locals.db, prescriptionID);

        if (p === null) {
            return fail(404, {error: "Prescription not found"});
        }

        // TODO: Change to locals.user.id once auth/users is set up
        await fillPrescription(locals.db, p, locals.user?.id ?? "NAN");
    }
};
