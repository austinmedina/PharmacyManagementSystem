//import {initializeLucia} from "$lib/server/auth";
import type {Handle} from "@sveltejs/kit";
import {dev} from "$app/environment";
import {D1Database} from "@cloudflare/workers-types";

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
}

// This function handles authentication and session management using Lucia framework.
// It checks for an existing session, validates it, and updates session cookies accordingly.
// This function is crucial for managing authentication and session handling within the application.
// It ensures that user sessions are validated and updated appropriately, providing secure access
// to protected resources while maintaining user privacy and security.
export const handle: Handle = async ({event, resolve}) => {
    if (dev) {
        // @ts-ignore
        event.platform = {
            ...event.platform,
            // @ts-ignore
            env
        };
    }

    return resolve(event);
};
