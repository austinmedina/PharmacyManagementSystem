import type {UserType} from "$lib/types";
import {getAllInventory} from "$lib/util";
import {error} from "@sveltejs/kit";
import type {LayoutServerLoad} from "./$types";

export const load: LayoutServerLoad = async ({locals}) => {
    if (locals.user == null) {
        error(401);
    }

    const userId = locals.user.id;
    const db = locals.db;

    const result = await db
        .prepare(`SELECT type FROM users WHERE id = ?`)
        .bind(userId)
        .first();

    if (!result) {
        return {
            userType: null
        };
    }

    const inventory = await getAllInventory(db);

    return {
        userType: result.type as UserType,
        inventory: inventory
    };
};
