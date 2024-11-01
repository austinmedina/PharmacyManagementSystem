import {redirect} from "@sveltejs/kit";
import type {Actions} from "./$types";

export const actions: Actions = {
    logout: async (event) => {
        if (event.locals.session?.id) {
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
