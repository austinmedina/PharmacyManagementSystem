import {checkAccess, deletePatient, loadPatients} from "$lib/util";
import type {D1Database} from "@cloudflare/workers-types";
import type {RequestHandler} from "../user/$types";
import {UserType} from "$lib/types";
/* The following two functions are API endpoints that are called by the patient component which is implemented on the viewPatients page.  */

/*This API endpoint allows for any componenet to call it and delete a patient using the common util function deletePatient. 
  It returns a string if deleted */
export const DELETE: RequestHandler = async ({request, locals}) => {
    checkAccess(locals.user?.type, [UserType.Pharmacist, UserType.Manager]);
    const {patientId} = (await request.json()) as {patientId: number};

    try {
        await deletePatient(locals.db as D1Database, patientId);
        return new Response("Patient deleted", {status: 200});
    } catch (error) {
        // Check if error is an instance of Error
        if (error instanceof Error) {
            console.error(error.message); // Log the error message
            return new Response("Failed to delete patient: " + error.message, {
                status: 500
            });
        } else {
            console.error(
                "Failed to delete patient: An unknown error occurred."
            );
            return new Response("Failed to delete patient", {status: 500});
        }
    }
};

/*This API endpoint allows for any componenet to call it and fetch an updated list of all patients using the common util function loadPatients. 
  It returns a list of patients and is usually called upon deletion of a patient*/
export const GET: RequestHandler = async ({locals}) => {
    checkAccess(locals.user?.type);
    try {
        const patients = await loadPatients(locals.db as D1Database);
        return new Response(JSON.stringify({patients}), {status: 200});
    } catch (error) {
        // Log the error to provide more context on what went wrong
        console.error("Error fetching patients:", error);
        return new Response("Failed to fetch patients", {status: 500});
    }
};
