import type {UserType} from "$lib/types";
import type {LayoutServerLoad} from "../../../.svelte-kit/types/src/routes/(app)/$types.d.ts";

export const load: LayoutServerLoad = async ({locals}) => {
    if (!locals.user) {
        return {
            userType: null
        };
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

    return {
        userType: result.type as UserType
    };
};
