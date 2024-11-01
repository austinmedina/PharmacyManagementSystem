import {initializeLucia} from "$lib/server/auth";
import type {Handle} from "@sveltejs/kit";
import {dev} from "$app/environment";
import type {D1Database} from "@cloudflare/workers-types/experimental";
import type {User} from "$lib/types";

let env = {};

if (dev) {
    const {Miniflare} = await import("miniflare");

    const mf = new Miniflare({
        d1Databases: ["DB"],
        d1Persist: ".wrangler/state/v3/d1",
        modules: true,
        script: ""
    });
    env = await mf.getBindings();

    // Load all migrations from migrations folder
    const migrations = import.meta.glob("$lib/server/migrations/*.sql", {
        query: "?raw",
        eager: true
    });

    for (const m of Object.keys(migrations).sort()) {
        // @ts-expect-error TS doesn't know what's in migrations
        let migration: string = migrations[m]["default"] as unknown as string;
        // Skip first line (comment) to avoid errors and make sure the only newlines
        //     are at the end of each statement
        const i = migration.indexOf("\n");
        migration = migration
            .slice(i + 1)
            .replaceAll("\n", "")
            .replaceAll(";", ";\n");
        // console.log(migration);

        // Run all migrations, in order
        // @ts-expect-error DB does exist
        await env.DB.exec(migration);
    }
    // await env.DB.exec(migrations);
}

// This function handles authentication and session management using Lucia framework.
// It checks for an existing session, validates it, and updates session cookies accordingly.
// This function is crucial for managing authentication and session handling within the application.
// It ensures that user sessions are validated and updated appropriately, providing secure access
// to protected resources while maintaining user privacy and security.
export const handle: Handle = async ({event, resolve}) => {
    if (dev) {
        event.platform = {
            ...event.platform,
            // @ts-expect-error DB present in both dev and prod
            env
        };
    }

    //function returns a lucia type for authentication purposes.
    // try {
    event.locals.lucia = initializeLucia(event.platform?.env.DB as D1Database);
    // } catch (e: any) {
    //     //TODO: We might have to check for the exsistence of tables later.
    //     event.locals.lucia = initializeLucia(
    //         event.platform?.env.DB as D1Database
    //     );
    // }

    const sessionId = event.cookies.get(event.locals.lucia.sessionCookieName);
    if (!sessionId) {
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }

    const {session, user} = await event.locals.lucia.validateSession(sessionId);
    if (session && session.fresh) {
        const sessionCookie = event.locals.lucia.createSessionCookie(
            session.id
        );
        // sveltekit types deviates from the de-facto standard
        // you can use 'as any' too
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });
    }
    if (!session) {
        const sessionCookie = event.locals.lucia.createBlankSessionCookie();
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });
    }

    event.locals.user = user as User;
    event.locals.session = session;
    event.locals.db = event.platform?.env.DB as D1Database;

    return resolve(event);
};
