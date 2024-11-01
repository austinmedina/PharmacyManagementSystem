import type {UserType} from "$lib/types";
import type {LayoutServerLoad} from "./$types";

export const load: LayoutServerLoad = async ({locals}) => {
    console.log("Locals:", locals);

    if (!locals.user) {
        console.log(`User not found`);
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
        console.log(`User not found: ${userId}`);
        return {
            userType: null
        };
    }

    console.log(`User found: ${userId} (${result.type})`);
    return {
        userType: result.type as UserType
    };
};
