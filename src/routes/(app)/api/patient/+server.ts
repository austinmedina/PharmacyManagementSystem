import {deletePatient, loadPatients} from "$lib/util";
import type {D1Database} from "@cloudflare/workers-types";

export const DELETE = async ({request, locals}) => {
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

export const GET = async ({locals}) => {
    try {
        const patients = await loadPatients(locals.db as D1Database);
        return new Response(JSON.stringify({patients}), {status: 200});
    } catch (error) {
        // Log the error to provide more context on what went wrong
        console.error("Error fetching patients:", error);
        return new Response("Failed to fetch patients", {status: 500});
    }
};
