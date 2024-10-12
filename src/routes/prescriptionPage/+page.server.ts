import type {PageServerLoad, Actions} from "./$types";
import {loadProducts} from "$lib/util";

export const load: PageServerLoad = async ({platform}) => {
    const products = await loadProducts(
        platform?.env.DB as unknown as D1Database
    );
    return {
        products: products
    };
};

export const actions = {
    default: async ({request}) => {
        // Prefixed with underscore to avoid unused var warning
        const _data = await request.formData();
        //Insert into database here
    }
} satisfies Actions;
