import type {PageServerLoad} from "./$types.js";
import {
    getAllInventory,
    loadPrescriptions,
    logPurchase,
    pickUpPrescription,
    removeInventory
} from "$lib/util.js";
import {ProductType} from "$lib/types.js";
import {generateId} from "lucia";

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
        const cartID = generateId(15);
        const date = new Date().toISOString();
        if (cartData != null) {
            const cart = JSON.parse(cartData as string);
            for (let i = 0; i < cart.length; i++) {
                if ("pickedUp" in cart[i]) {
                    await pickUpPrescription(db, cart[i]);
                    await logPurchase(
                        db,
                        date,
                        cart[i].product.id,
                        cart[i].quantity * cart[i].product.price,
                        cart[i].quantity,
                        cartID
                    );
                } else if (cart[i].quantity > 0) {
                    await removeInventory(db, cart[i].id, cart[i].quantity);
                    await logPurchase(
                        db,
                        date,
                        cart[i].id,
                        cart[i].quantity * cart[i].price,
                        cart[i].quantity,
                        cartID
                    );
                }
            }
        }
    }
};
