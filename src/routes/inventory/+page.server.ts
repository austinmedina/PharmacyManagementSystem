import type {PageServerLoad, Actions} from "./$types.js";
import {addInventory, getAllInventory, removeInventory} from "$lib/util.js";

export const load: PageServerLoad = async ({platform}) => {
    const db = platform?.env.DB as D1Database;
    const inventory = await getAllInventory(db);
    return {
        inventory: inventory
    };
};

export const actions: Actions = {
    add: async ({locals, request}) => {
        const data = await request.formData();
        await addInventory(
            locals.db,
            data.get("productID") as unknown as number,
            data.get("expirationDate") as unknown as string,
            data.get("quantity") as unknown as number
        );
    },
    remove: async ({request, locals}) => {
        const data = await request.formData();
        await removeInventory(
            locals.db,
            data.get("productID") as unknown as number,
            data.get("quantity") as unknown as number
        );
    }
};
