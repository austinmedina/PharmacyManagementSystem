import {redirect} from "@sveltejs/kit";
import type {Actions} from "./$types";
import {checkAccess, logLogLogLog} from "$lib/util";

export const actions: Actions = {
    logout: async (event) => {
        checkAccess(event.locals.user?.type);
        const date = new Date().toISOString();
        const userID = String(event.locals.user?.id);

        if (event.locals.session?.id) {
            // Log the logout
            await logLogLogLog(event.locals.db, date, userID, 1);

            await event.locals.lucia.invalidateSession(event.locals.session.id);

            event.locals.session = null;
            event.locals.user = null;

            throw redirect(302, "/");
        }

        // Return the user data if the session is still valid (not logged out)
        return {
            user: event.locals.user
        };
    }
};
