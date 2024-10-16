<script lang="ts">
    export let patient;
    export let onPatientRemoved;

    const removePatient = async (patientID: number, patientName: string) => {
        try {
            const response = await fetch("/api/patient", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({patientId: patientID})
            });

            if (!response.ok) {
                throw new Error("Failed to delete patient");
            } else {
                console.log(`Patient with ID ${patientID} has been deleted.`);
                onPatientRemoved(patientName);
            }
        } catch (error) {
            // Check if error is an instance of Error
            if (error instanceof Error) {
                console.error(`Error deleting patient: ${error.message}`);
            } else {
                console.error(
                    `Error deleting patient: An unknown error occurred.`
                );
            }
        }
    };
    let expanded = false;
</script>

<div class="flex-col bg-neutral-200 p-4 rounded-3xl">
    <div id="patientHeader" class="flex w-full justify-between items-center">
        <button
            class="text-left flex-1"
            on:click={() => (expanded = !expanded)}>
            <strong>{patient.firstName + " " + patient.lastName}</strong>
        </button>
        <button
            class="text-right bg-purple-500 hover:bg-red-700 text-white py-1 px-4 rounded-xl"
            on:click={() =>
                removePatient(
                    patient.id,
                    patient.firstName + " " + patient.lastName
                )}>
            Remove Patient
        </button>
    </div>
    <div
        class={`text-left dropdown mt-2 ml-8 ${expanded ? "visible" : "hidden"}`}>
        <p>
            <strong>Date of Birth:</strong>
            {new Date(patient.dateOfBirth).toLocaleDateString()}
        </p>
        <p><strong>Email:</strong> {patient.email}</p>
        <p>
            <strong>Phone:</strong>
            {patient.phone.substring(0, 3)}-{patient.phone.substring(
                3,
                6
            )}-{patient.phone.substring(6)}
        </p>
        <p><strong>Insurance:</strong> {patient.insurance ? "Yes" : "No"}</p>
    </div>
</div>
