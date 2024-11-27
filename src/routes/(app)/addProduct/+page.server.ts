import {UserType, type ProductType} from "$lib/types";
import {addProduct, checkAccess} from "$lib/util";
import {redirect} from "@sveltejs/kit";
import type {Actions} from "./$types";
import type {PageServerLoad} from "./$types";

export const load: PageServerLoad = async ({locals}) => {
    checkAccess(locals.user?.type, [UserType.Manager]);
};

export const actions: Actions = {
    default: async ({locals, request}) => {
        checkAccess(locals.user?.type, [UserType.Manager]);

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
