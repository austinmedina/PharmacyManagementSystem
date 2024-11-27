// See https://kit.svelte.dev/docs/types#app

import type {D1Database} from "@cloudflare/workers-types";

// for information about these interfaces
declare global {
    namespace App {
        interface Locals {
            db: D1Database;
            lucia: import("$lib/server/auth").Auth;
            user: import("$lib/server/auth").DatabaseUserAttributes | null;
            session: import("lucia").Session | null;
        }
        interface Platform {
            env: {
                DB: D1Database;
            };
            context: {
                waitUntil(promise: Promise<any>): void;
            };
            caches: CacheStorage & {default: Cache};
            cf: CfProperties;
            ctx: ExecutionContext;
        }
    }
    declare module "*.numbers" {
        const data: string;
        export default data;
    }
    declare module "*.xlsx" {
        const data: string;
        export default data;
    }
}

export {};
