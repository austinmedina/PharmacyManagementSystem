import type {PageServerLoad} from "./$types.js";
import {loadUsers} from "$lib/util";

export const load: PageServerLoad = async ({locals}) => {
    const users = await loadUsers(locals.db);

    return {
        user: users
    };
};
