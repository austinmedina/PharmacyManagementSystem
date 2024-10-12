import type {D1Database} from "@cloudflare/workers-types";
import * as types from "./types";

export async function loadProducts(db: D1Database): Promise<types.Product[]> {
    return (await db.prepare("SELECT * FROM products").run()).results.map(
        (product) => {
            product["type"] = types.ProductType[product["type"] as number];
            return product as types.Product;
        }
    );
}
