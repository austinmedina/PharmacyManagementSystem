import {deleteUser} from "$lib/util";
import type {D1Database} from "@cloudflare/workers-types";

export const DELETE = async ({request, locals}) => {
    const {userId} = (await request.json()) as {userId: number};

    try {
        await deleteUser(locals.db as D1Database, userId);
        return new Response("User deleted", {status: 200});
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message); // Log the error message
            return new Response("Failed to delete user: " + error.message, {
                status: 500
            });
        } else {
            console.error("Failed to delete user: An unknown error occurred.");
            return new Response("Failed to delete user", {status: 500});
        }
    }
};
export const POST = async ({request, locals}) => {
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
            console.error(error.message); // Log the error message
            return new Response("Failed to recover user: " + error.message, {
                status: 500
            });
        } else {
            console.error("Failed to recover user: An unknown error occurred.");
            return new Response("Failed to recover user", {status: 500});
        }
    }
};
