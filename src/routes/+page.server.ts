import type {D1Database} from "@cloudflare/workers-types";
import {fail, redirect, error} from "@sveltejs/kit";
import {Argon2id} from "$lib/server/Argon2id.min";
import {loadUser_by_username} from "$lib/util";

import type {Actions, PageServerLoad, RequestEvent} from "./$types";
import {UserType, type User} from "$lib/types";

export async function _doesUsernameExist(db: D1Database, username: string) {
    const errors = [];

    try {
        const results = db
            .prepare(
                "SELECT COUNT(*) AS count FROM users WHERE username LIKE ?1"
            )
            .bind(username);
        const total = await results.first("count");

        if (total === 0) {
            errors.push("Invalid Username or Password, Please try again");
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            errors.push(error.message);
        } else {
            errors.push("An unknown error occurred.");
        }
    }

    if (errors.length > 0) {
        throw new Error(errors.join("\n"));
    }
}

export const load: PageServerLoad = async (event) => {
    if (event.locals.user?.id != null) {
        error(403, "You are not authorized to view this page");
    }
};

export const actions: Actions = {
    login: async (event: RequestEvent) => {
        const formData = await event.request.formData();
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        let existingUser;

        if (
            typeof username !== "string" ||
            username.length < 3 ||
            username.length > 31 ||
            !/^[a-zA-Z0-9+=!#$%^&*_-]/.test(username)
        ) {
            return fail(422, {
                error: true,
                message: "Invalid username"
            });
        }
        if (
            typeof password !== "string" ||
            password.length < 6 ||
            password.length > 255 ||
            !/^[a-zA-Z0-9+=!#$%^&*_-]/.test(username)
        ) {
            return fail(422, {
                error: true,
                message: "Invalid password"
            });
        }

        try {
            if (!event.platform?.env.DB) {
                const message = "DB IS NULL";
                return fail(422, {
                    error: true,
                    message
                });
            }

            await _doesUsernameExist(event.platform?.env.DB, username);

            existingUser = (await loadUser_by_username(
                event.platform?.env.DB,
                username
            )) as User;

            const validPassword = await Argon2id.verify(
                existingUser?.password,
                password
            );

            if (!validPassword) {
                throw new Error("Incorrect username or password");
            }
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred";

            return fail(404, {
                error: true,
                message
            });
        }

        const session = await event.locals.lucia.createSession(
            existingUser?.id,
            {}
        );
        const sessionCookie = event.locals.lucia.createSessionCookie(
            session.id
        );
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });

        if (existingUser.type === UserType.Manager) {
            redirect(302, "/createUser");
        } else if (
            existingUser.type === UserType.Cashier ||
            existingUser.type === UserType.Technician
        ) {
            redirect(302, "/checkout");
        } else if (existingUser.type === UserType.Pharmacist) {
            redirect(302, "/inventory");
        }
    }
};
