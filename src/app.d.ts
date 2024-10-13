// See https://kit.svelte.dev/docs/types#app

import type {D1Database} from "@cloudflare/workers-types";

// for information about these interfaces
declare global {
    namespace App {
        interface Locals {
            db: D1Database;
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
}

export {};
