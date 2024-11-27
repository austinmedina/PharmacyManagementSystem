import {fail} from "@sveltejs/kit";
import {generateId} from "lucia";
import {Argon2id} from "$lib/server/Argon2id.min";
import type {D1Database} from "@cloudflare/workers-types";
import type {Actions} from "@sveltejs/kit";
import type {User, UserID} from "$lib/types";
import {UserType} from "$lib/types";
import {checkAccess} from "$lib/util";
import type {PageServerLoad} from "./$types";

export const load: PageServerLoad = async ({locals}) => {
    checkAccess(locals.user?.type, [UserType.Manager]);
};

export const _validateInput = (user: User, password: string) => {
    const errors = [];

    if (
        typeof user.username !== "string" ||
        user.username.length < 3 ||
        user.username.length > 31 ||
        !/^[a-zA-Z0-9+=!#$%^&*_-]+$/.test(user.username)
    ) {
        errors.push("Invalid username");
    }

    if (
        typeof password !== "string" ||
        password.length < 6 ||
        password.length > 255 ||
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[+=!@#$%^&*_-]).{6,255}$/.test(
            password
        )
    ) {
        errors.push("Invalid password");
    }

    if (
        typeof user.firstName !== "string" ||
        user.firstName.length < 1 ||
        user.firstName.length > 255 ||
        !/^[a-zA-Z\s]+$/.test(user.firstName)
    ) {
        errors.push("Invalid first name");
    }

    if (
        typeof user.lastName !== "string" ||
        user.lastName.length < 1 ||
        user.lastName.length > 255 ||
        !/^[a-zA-Z\s]+$/.test(user.lastName)
    ) {
        errors.push("Invalid last name");
    }

    if (errors.length > 0) {
        throw new Error(errors.join("\n"));
    }
    return "null";
};

export async function _checkUsers(
    db: D1Database,
    user_id: string
): Promise<boolean> {
    const errors = [];

    try {
        const result = await db
            .prepare(`SELECT COUNT(*) AS total FROM users WHERE username = ?`)
            .bind(user_id);
        const total = await result.first("total");

        if (total === 0) {
            return true;
        } else {
            errors.push("Username already taken. Please make a new username");
        }
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "An unknown error occurred";
        errors.push(message);
    }

    if (errors.length > 0) {
        throw new Error(errors.join("\n"));
    }
    return false;
}

export function _getUserTypeFromValue(
    userTypeString: number
): UserType | undefined {
    switch (userTypeString) {
        case 0:
            return UserType.Manager;
        case 1:
            return UserType.Pharmacist;
        case 2:
            return UserType.Cashier;
        case 3:
            return UserType.Technician;
        default:
            return undefined;
    }
}

export const actions: Actions = {
    default: async ({request, locals}) => {
        checkAccess(locals.user?.type, [UserType.Manager]);

        const formData = await request.formData();
        const id: UserID = generateId(15);
        const tempPass = formData.get("password") as string;
        const hashedPassword = await Argon2id.hashEncoded(tempPass);
        const userTypeValue = parseInt(formData.get("userType") as string);
        const userType = _getUserTypeFromValue(userTypeValue);
        let user;

        try {
            user = {
                id: id,
                password: hashedPassword,
                username: formData.get("username") as string,
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                type: userType as UserType,
                lockout: false,
                login_attempts: 0,
                is_first_login: true
            };

            _validateInput(user, tempPass);

            if (!locals.db) {
                const message = "DB IS NULL";
                return fail(422, {
                    error: true,
                    message
                });
            }

            let isCreated;

            if (await _checkUsers(locals.db, user.username)) {
                isCreated = await locals.db
                    .prepare(
                        "INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);"
                    )
                    .bind(
                        user.username,
                        user.firstName,
                        user.lastName,
                        user.username,
                        user.password,
                        user.type,
                        user.lockout,
                        user.login_attempts,
                        user.is_first_login
                    )
                    .run();
            }

            if (isCreated) {
                return {
                    success: true,
                    error: -1,
                    message: "User created successfully"
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
    }
};
