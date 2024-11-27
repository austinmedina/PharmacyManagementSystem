import {deletePrescription, loadPrescriptions} from "$lib/util";
import type {D1Database} from "@cloudflare/workers-types";
/* The following two functions are API endpoints that are called by the patient component which is implemented on the viewPatients page.  */

/*This API endpoint allows for any componenet to call it and delete a prescription using the common util function deletePrescription. It returns a string if deleted */
export const DELETE = async ({request, locals}) => {
    const {prescriptionId} = (await request.json()) as {prescriptionId: number};

    try {
        await deletePrescription(locals.db as D1Database, prescriptionId);
        return new Response("Prescription deleted", {status: 200});
    } catch (error) {
        // Check if error is an instance of Error
        if (error instanceof Error) {
            console.error(error.message); // Log the error message
            return new Response(
                "Failed to delete prescription: " + error.message,
                {
                    status: 500
                }
            );
        } else {
            console.error(
                "Failed to delete prescription: An unknown error occurred."
            );
            return new Response("Failed to delete prescription", {status: 500});
        }
    }
};

/*This API endpoint allows for any componenet to call it and fetch an updated list of all prescriptions using the common util function loadPprescriptions. It returns a list of patients and is usually called upon deletion of a prescription*/
export const GET = async ({locals}) => {
    try {
        const prescriptions = await loadPrescriptions(locals.db as D1Database);
        return new Response(JSON.stringify({prescriptions}), {status: 200});
    } catch (error) {
        // Log the error to provide more context on what went wrong
        console.error("Error fetching prescriptions:", error);
        return new Response("Failed to fetch prescriptions", {status: 500});
    }
};
