import type {PageServerLoad, Actions} from "./$types.js";
import {
    addInventory,
    checkAccess,
    getAllInventory,
    removeInventory
} from "$lib/util.js";
import {UserType} from "$lib/types.js";

export const load: PageServerLoad = async ({locals}) => {
    checkAccess(locals.user?.type, [UserType.Manager]);

    const db = locals.db as D1Database;
    const inventory = await getAllInventory(db);
    return {
        inventory: inventory
    };
};

export const actions: Actions = {
    add: async ({locals, request}) => {
        checkAccess(locals.user?.type, [UserType.Manager]);
        const data = await request.formData();
        await addInventory(
            locals.db,
            data.get("productID") as unknown as number,
            data.get("expirationDate") as unknown as string,
            data.get("quantity") as unknown as number
        );
    },
    remove: async ({request, locals}) => {
        checkAccess(locals.user?.type, [UserType.Manager]);
        const data = await request.formData();
        await removeInventory(
            locals.db,
            data.get("productID") as unknown as number,
            data.get("quantity") as unknown as number
        );
    }
};
