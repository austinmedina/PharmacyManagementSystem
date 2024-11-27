import type {PageServerLoad} from "./$types.js";
import {
    loadInventoryReport,
    loadFinancialReport,
    loadProducts,
    checkAccess
} from "$lib/util";
import {UserType} from "$lib/types.js";

export const load: PageServerLoad = async ({locals}) => {
    checkAccess(locals.user?.type, [UserType.Manager]);
    const inventoryReports = await loadInventoryReport(locals.db);
    const financialReports = await loadFinancialReport(locals.db);
    const products = await loadProducts(locals.db);

    return {
        inventoryReport: inventoryReports,
        financialReport: financialReports,
        product: products
    };
};
