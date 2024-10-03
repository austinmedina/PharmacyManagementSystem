import type { PageServerLoad } from './$types'
import { loadProducts } from '$lib/util'
import { ProductType } from '$lib/types'


export const load: PageServerLoad = async ({ platform }) => {
    let products = await loadProducts(platform?.env.DB as unknown as D1Database);
    return {
		products:products
    }
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		//Insert into database here
	}
};