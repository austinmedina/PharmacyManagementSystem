import type {PageServerLoad} from "./$types.js";
import {
    loadInventoryReport,
    loadFinancialReport,
    loadProducts
} from "$lib/util";

export const load: PageServerLoad = async ({locals}) => {
    const inventoryReports = await loadInventoryReport(locals.db);
    const financialReports = await loadFinancialReport(locals.db);
    const products = await loadProducts(locals.db);

    return {
        inventoryReport: inventoryReports,
        financialReport: financialReports,
        product: products
    };
};
