import type {PageServerLoad} from "./$types.js";
import {
    getAllInventory,
    loadPrescriptions,
    pickUpPrescription,
    removeInventory
} from "$lib/util.js";
import {ProductType} from "$lib/types.js";

export const load: PageServerLoad = async ({locals}) => {
    const db = locals.db;
    let inventory = await getAllInventory(db);
    inventory = inventory.filter(
        (item) => item.type === ProductType.NonPrescription
    );
    const prescriptions = await loadPrescriptions(db, true, false, false);

    return {
        inventory: inventory,
        prescriptions: prescriptions
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
                if ("pickedUp" in cart[i]) {
                    await pickUpPrescription(db, cart[i]);
                } else {
                    await removeInventory(db, cart[i].id, cart[i].quantity);
                }
            }
        }
    }
};
