import type {PageServerLoad} from "./$types";
import {LogType, type LogEntry} from "$lib/types";
import {redirect} from "@sveltejs/kit";
import {
    checkAccess,
    loadFillLogs,
    loadInventoryLogs,
    loadLogLogLogs,
    loadPurchaseLogs
} from "$lib/util";

export const load: PageServerLoad = async ({locals, url}) => {
    checkAccess(locals.user?.type);
    try {
        // Checking log type
        const type: LogType = parseInt(url.searchParams.get("type") ?? "0");
        let logs: LogEntry[] = [];

        // Loading logs of correct type from db
        if (type == LogType.LogLog) {
            logs = await loadLogLogLogs(locals.db);
        } else if (type == LogType.Purchase) {
            logs = await loadPurchaseLogs(locals.db);
        } else if (type == LogType.Inventory) {
            logs = await loadInventoryLogs(locals.db);
        } else if (type == LogType.Fill) {
            logs = await loadFillLogs(locals.db);
        }
        return {
            type: type,
            logs
        };
    } catch (e) {
        console.error(e);
        redirect(307, "/logs");
    }
};
