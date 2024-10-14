import type {PageServerLoad, Actions} from "./$types";
import {findInventory, getPrescription, loadPrescriptions} from "$lib/util";
import {fail} from "@sveltejs/kit";
import {InventoryAction} from "$lib/types";

export const load: PageServerLoad = async ({locals}) => {
    return {
        prescriptions: await loadPrescriptions(locals.db, false, true)
    };
};

export const actions: Actions = {
    fill: async ({request, locals}) => {
        const data = await request.formData();
        const prescriptionID = parseInt(data.get("prescriptionID") as string);
        console.log(`Filled prescription: ${prescriptionID}`);

        // Load prescription from db, don't pass it from the client.
        // Never trust client-side data.
        const p = await getPrescription(locals.db, prescriptionID);

        if (p === null) {
            return fail(404, {error: "Prescription not found"});
        }

        // List of inventory we have for the product, already sorted by expiration date
        const inventory = await findInventory(locals.db, p.product.id);

        const used_inventory = [];
        let needed_quantity = p.quantity;

        // Figuring out which/how many of our inventory batches we need to fill the order
        for (const i of inventory) {
            if (i.quantity >= needed_quantity) {
                used_inventory.push({item: i, amount: needed_quantity});
                break;
            } else {
                used_inventory.push({item: i, amount: i.quantity});
                needed_quantity -= i.quantity;
            }
        }

        // Creating a list of db statments to execute all in one transaction,
        //  so that if anything fails, or the inventory amount changed since
        //  we last checked, all of our db modifications get rolled back at
        //  once and we don't end up with our db in an invalid state.
        const statements = [
            locals.db
                .prepare("UPDATE prescriptions SET filled = TRUE WHERE id = ?")
                .bind(prescriptionID),

            // TODO: Change userID to locals.user.id once auth and users are set up
            locals.db
                .prepare(
                    "INSERT INTO fill_log (time, prescriptionID, userID) VALUES (?, ?, ?)"
                )
                .bind(new Date().toISOString(), prescriptionID, 1)
        ];

        // Making reusable statments, because they could be reused in the loop.
        const delete_statement = locals.db.prepare(
            "DELETE FROM inventory WHERE id = ?"
        );
        const log_statement = locals.db.prepare(
            "INSERT INTO inventory_log (time, productID, action, quantity) VALUES (?, ?, ?, ?)"
        );
        for (const i of used_inventory) {
            if (i.item.quantity == i.amount) {
                statements.push(delete_statement.bind(i.item.id));
            } else {
                // This branch will only be run once, so no reusable statment necessary.
                statements.push(
                    locals.db
                        .prepare(
                            "UPDATE inventory SET quantity = ? WHERE id = ?"
                        )
                        .bind(i.item.quantity - i.amount, i.item.id)
                );
            }
            // Add log entry for inventory change
            statements.push(
                log_statement.bind(
                    new Date().toISOString(),
                    i.item.productID,
                    InventoryAction.Out,
                    i.amount
                )
            );
        }

        await locals.db.batch(statements);
    }
};
