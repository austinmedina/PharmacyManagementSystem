import type {D1Database} from "@cloudflare/workers-types";
import {fail, redirect, error} from "@sveltejs/kit";
import {Argon2id} from "$lib/server/Argon2id.min";
import {loadUser_by_username} from "$lib/util";

import type {Actions, PageServerLoad, RequestEvent} from "./$types";
import {UserType, type User} from "$lib/types";

const MAX_ATTEMPTS = 3;

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

            // Check if user is locked out
            if (existingUser.lockout) {
                return fail(403, {
                    error: true,
                    message:
                        "Account locked. Please contact your manager to unlock it."
                });
            }

            const validPassword = await Argon2id.verify(
                existingUser?.password,
                password
            );

            if (!validPassword) {
                await event.platform?.env.DB.prepare(
                    "UPDATE users SET login_attempts = login_attempts + 1 WHERE username = ?1"
                )
                    .bind(username)
                    .run();

                if (existingUser.login_attempts + 1 >= MAX_ATTEMPTS) {
                    await event.platform?.env.DB.prepare(
                        "UPDATE users SET lockout = TRUE WHERE username = ?"
                    )
                        .bind(username)
                        .run();

                    return fail(403, {
                        error: true,
                        message:
                            "Account locked. Please contact your manager to unlock it."
                    });
                }

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

        //Reset attempts on successful login
        await event.platform?.env.DB.prepare(
            "UPDATE users SET login_attempts = ?, lockout = ? WHERE username = ?;"
        )
            .bind(0, false, username)
            .run();

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

        if (existingUser.is_first_login) {
            redirect(302, "/profile");
        } else {
            redirect(302, "/home");
        }
    }
};
