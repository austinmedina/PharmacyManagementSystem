import type {PageServerLoad} from "./$types.js";
import {checkAccess, loadUsers} from "$lib/util";
import {UserType} from "$lib/types.js";
//Loads in user data
export const load: PageServerLoad = async ({locals}) => {
    checkAccess(locals.user?.type, [UserType.Manager]);

    const users = await loadUsers(locals.db);

    return {
        user: users
    };
};
