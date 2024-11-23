import type {PageServerLoad} from "./$types";
import type {LogType} from "$lib/types";
import {loadLogs} from "$lib/util";
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async ({locals, url}) => {
    // console.log(url.searchParams.get("type"));
    try {
        const type: LogType = parseInt(url.searchParams.get("type") ?? "0");
        return {
            type: type,
            logs: await loadLogs(locals.db, type)
        };
    } catch (_) {
        redirect(307, "/logs");
    }
};
