import type {PageServerLoad, Actions} from "./$types";
import {loadPrescriptions} from "$lib/util";

export const load: PageServerLoad = async ({locals}) => {
    return {
        prescriptions: await loadPrescriptions(locals.db, false)
    };
};

export const actions: Actions = {
    fill: async ({request, locals}) => {
        const data = await request.formData();
        const prescriptionID = parseInt(data.get("prescriptionID") as string);
        console.log(`Filled prescription: ${prescriptionID}`);

        // TODO: Log fill, mark as filled (new db col?), update inventory, all in same db transaction
        await locals.db.batch([
            locals.db
                .prepare("UPDATE prescriptions SET filled = TRUE WHERE id = ?")
                .bind(prescriptionID)
        ]);
    }
};
