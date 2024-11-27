import {checkAccess, deleteUser} from "$lib/util";
import type {D1Database} from "@cloudflare/workers-types";
import type {RequestHandler} from "./$types";
import {UserType} from "$lib/types";
//Delete user functionality, ensuring user is deleted from db
export const DELETE: RequestHandler = async ({request, locals}) => {
    checkAccess(locals.user?.type, [UserType.Manager]);

    const {userId} = (await request.json()) as {userId: number};

    try {
        await deleteUser(locals.db as D1Database, userId);
        return new Response("User deleted", {status: 200});
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return new Response("Failed to delete user: " + error.message, {
                status: 500
            });
        } else {
            console.error("Failed to delete user: An unknown error occurred.");
            return new Response("Failed to delete user", {status: 500});
        }
    }
};
//Recover user functionality allows them to retry logging in
export const POST: RequestHandler = async ({request, locals}) => {
    checkAccess(locals.user?.type, [UserType.Manager]);

    const {userId} = (await request.json()) as {userId: number};

    try {
        await locals.db
            .prepare(
                "UPDATE users SET lockout = ?, login_attempts = ? WHERE id = ?;"
            )
            .bind(false, 0, userId)
            .run();
        return new Response("User recovered", {status: 200});
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return new Response("Failed to recover user: " + error.message, {
                status: 500
            });
        } else {
            console.error("Failed to recover user: An unknown error occurred.");
            return new Response("Failed to recover user", {status: 500});
        }
    }
};
