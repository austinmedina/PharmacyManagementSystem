import type {ProductType} from "$lib/types";
import {addProduct} from "$lib/util";
import {redirect} from "@sveltejs/kit";
import type {Actions} from "./$types";

export const actions: Actions = {
    default: async ({locals, request}) => {
        const data = await request.formData();
        await addProduct(
            locals.db,
            data.get("name") as unknown as string,
            data.get("price") as unknown as number,
            data.get("type") as unknown as ProductType
        );
        redirect(301, "/inventory");
    }
};
