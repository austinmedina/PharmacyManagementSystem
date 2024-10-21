import type {PageServerLoad} from "./$types.js";
import {getAllInventory, removeInventory} from "$lib/util.js";

export const load: PageServerLoad = async ({locals}) => {
    const db = locals.db;
    const inventory = await getAllInventory(db);
    return {
        inventory: inventory
    };
};

export const actions = {
    default: async ({request, locals}) => {
        const db = locals.db;
        const data = await request.formData();
        const cartData = data.get("cart");
        if (cartData != null) {
            const cart = JSON.parse(cartData as string);
            for (let i = 0; i < cart.length; i++) {
                await removeInventory(db, cart[i].id, cart[i].quantity);
            }
        }
    }
};
