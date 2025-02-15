import {Argon2id} from "$lib/server/Argon2id.min";
import type {D1Database} from "@cloudflare/workers-types";
import type {Actions} from "@sveltejs/kit";
import type {User} from "$lib/types";
import type {PageServerLoad} from "./$types";
import {checkAccess} from "$lib/util";

async function loadUser_by_id(
    db: D1Database,
    id: string
): Promise<User | null> {
    const result = await db
        .prepare("SELECT * FROM users WHERE id = ? LIMIT 1;")
        .bind(id)
        .all();

    if (result.results.length > 0) {
        const user: User = result.results[0] as unknown as User;

        return user;
    }

    return null;
}

export const load: PageServerLoad = async ({locals}) => {
    checkAccess(locals.user?.type);
    const user = await loadUser_by_id(locals.db, locals.user?.id as string);

    const firstTimeLogin = user?.is_first_login ?? true;

    return {
        firstTimeLogin
    };
};

export const actions: Actions = {
    default: async ({request, locals}) => {
        checkAccess(locals.user?.type);
        const formData = await request.formData();
        const oldPass = formData.get("password") as string;
        const newPass = formData.get("new-password") as string;
        const confirmPass = formData.get("confirm-new-password") as string;

        if (newPass !== confirmPass) {
            return {
                success: false,
                error: 1,
                message: "New password and confirm password do not match\n"
            };
        }

        const hashedPassword = await Argon2id.hashEncoded(newPass);

        //get the user
        const user = (await loadUser_by_id(
            locals.db,
            locals.user?.id as unknown as string
        )) as User;

        //make sure the password is valid for the user
        const validPassword = await Argon2id.verify(user?.password, oldPass);

        if (validPassword) {
            let isSaved;

            try {
                //validate newPass is acceptable
                if (
                    typeof newPass !== "string" ||
                    newPass.length < 6 ||
                    newPass.length > 255 ||
                    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[+=!@#$%^&*_-]).{6,255}$/.test(
                        newPass
                    )
                ) {
                    return {
                        success: false,
                        error: 1,
                        message: "Invalid New Password"
                    };
                }

                //update pass
                isSaved = await locals.db
                    .prepare(
                        "UPDATE users SET password = ?, is_first_login = ? WHERE id = ?;"
                    )
                    .bind(hashedPassword, false, user.id)
                    .run();

                if (isSaved) {
                    return {
                        success: true,
                        error: -1,
                        message: "New Password Saved!"
                    };
                }
            } catch (error: unknown) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred";

                return {
                    success: false,
                    error: 1,
                    message: message
                };
            }
        } else {
            return {
                success: false,
                error: 1,
                message: "Invalid Password"
            };
        }
    }
};
