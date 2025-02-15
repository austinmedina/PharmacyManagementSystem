<script lang="ts">
    import type {PageData} from "./$types";
    import SearchableInput from "$lib/components/SearchableInput.svelte";

    export let data: PageData;

    import type {
        Prescription as PrescriptionType,
        Patient as PatientType,
        Product as ProductType
    } from "$lib/types";
    import {fade} from "svelte/transition";
    export let form;

    //This function reformats the prescriptions into a usable dictionary
    export let serverPrescriptions = data.prescriptions.reduce(
        (
            acc: {[key: number]: PrescriptionType[]},
            prescription: PrescriptionType
        ) => {
            const patientId = prescription.patient.id;
            if (!acc[patientId]) {
                acc[patientId] = [];
            }
            acc[patientId].push(prescription);
            return acc;
        },
        {}
    );
    export let serverPatients: PatientType[] = data.patients;
    export let serverProducts: ProductType[] = data.products;
    let displayed: {[key: number]: PrescriptionType[]} = {}; // Explicitly define the type for displayed
    let inputValue = "";
    let message = form?.success;
    //Sets the form displayed boolean based on whether there are errors and the error relates to creating a prescription
    let formDisplayed =
        form?.errors && form?.errors.formKey == "createPrescription"
            ? true
            : false;

    let numPills: number;
    let period: number;

    //Filters prescriptions based on the prescription name compared to the value inputted by the user
    const search = (
        prescriptions: {[key: number]: PrescriptionType[]},
        inputValue: string
    ): {[key: number]: PrescriptionType[]} => {
        displayed = {};
        if (inputValue !== "") {
            for (var key in prescriptions) {
                const patientName =
                    prescriptions[key][0].patient.firstName +
                    prescriptions[key][0].patient.lastName;
                if (
                    patientName.toLowerCase().includes(inputValue.toLowerCase())
                ) {
                    displayed[key] = prescriptions[key];
                }
            }
        } else {
            displayed = prescriptions;
        }
        return displayed;
    };

    let expandedPrescriptionIds = new Set<number>();

    /*There is a set, expandedPrescriptionIds which contains the IDs of prescription cards that are expanded. 
      When you toggle or untoggle a prescription card, its ID is added into the set or removed from it
      In the HTML there is code that checks if the ID is in the set, and if so displays the expanded information, otherwise only the name of the patient and the name of their prescriptions is displayed
      We use a set because it uses a key of the set, allowing svelte to reload the page dynamically anytime the set is updated
    */
    function toggleExpansion(prescriptionId: number) {
        expandedPrescriptionIds = new Set(expandedPrescriptionIds);
        if (expandedPrescriptionIds.has(prescriptionId)) {
            expandedPrescriptionIds.delete(prescriptionId);
        } else {
            expandedPrescriptionIds.add(prescriptionId);
        }
    }

    interface PrescriptionResponse {
        prescriptions: PrescriptionType[]; // Define the expected shape of the response
    }

    //A function fed into prescription component, which called the remove prescription API, then reloads the prescriptions upon successful removal
    const removePrescription = async (
        prescriptionID: number,
        patientName: string
    ) => {
        try {
            const response = await fetch("/api/prescription", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({prescriptionId: prescriptionID})
            });

            if (!response.ok) {
                throw new Error("Failed to delete prescription");
            } else {
                message = `Successfully Removed Prescription for ${patientName}`;
                const response = await fetch("/api/prescription", {
                    method: "GET"
                });
                if (response.ok) {
                    const data: PrescriptionResponse = await response.json();
                    serverPrescriptions = data.prescriptions.reduce(
                        (
                            acc: {[key: number]: PrescriptionType[]},
                            prescription: PrescriptionType
                        ) => {
                            const patientId = prescription.patient.id;
                            if (!acc[patientId]) {
                                acc[patientId] = [];
                            }
                            acc[patientId].push(prescription);
                            return acc;
                        },
                        {}
                    );
                } else {
                    console.error("Failed to fetch prescriptions");
                }
            }
        } catch (error) {
            message = `${error instanceof Error ? error.message : "An unknown error occurred."}`;
        }
    };

    //Constantly calls the search function to ensure the displayed options is updated
    $: displayed = search(serverPrescriptions, inputValue);
</script>

<main
    class="flex flex-col items-center text-center"
    in:fade={{delay: 400}}
    out:fade>
    <div id="pageHeader">
        <h1 class="text-4xl text-white my-4">
            <strong>View Prescriptions</strong>
        </h1>
        <button
            class="mb-6 rounded-xl bg-green-600 hover:bg-green-700 text-white py-1 px-4 text-xl"
            on:click|preventDefault={() => (formDisplayed = !formDisplayed)}>
            {formDisplayed
                ? "Return to Prescription List"
                : "Create New Prescription"}
        </button>
    </div>

    {#if message}
        <p class="success text-green-500 mb-4">{message}</p>
    {/if}

    <!-- If looking at the patients then display the prescription, otherwise if youve clicked create prescription dont display this page-->
    <div
        id="viewPrescriptions"
        class="w-full max-w-xl flex flex-col flex-grow gap-4 {formDisplayed
            ? 'hidden'
            : 'visible'}">
        <div id="allPrescriptionSearch">
            <input
                type="text"
                class="w-3/4 border-2 border-neutral-400 rounded-3xl px-2 py-1"
                placeholder="Search By Patient Name"
                autocomplete="off"
                bind:value={inputValue} />
        </div>
        <!-- If there are prescriptions in the displayed list then display the patient and their prescriptions -->
        <div
            id="prescriptionDisplay"
            class="flex flex-col items-center gap-4 mb-2 w-full overflow-y-auto scroll flex-grow max-h-[calc(80vh)]">
            {#if Object.keys(displayed).length > 0}
                <ul class="p-4 space-y-4 w-full">
                    {#each Object.entries(displayed) as [_key, value]}
                        <div class="bg-cyan-50 p-4 rounded-3xl space-y-2">
                            <h2 class="text-xl font-semibold">
                                {value[0].patient.firstName +
                                    " " +
                                    value[0].patient.lastName}
                            </h2>
                            {#each value as prescription}
                                <hr />
                                <div>
                                    <div
                                        class="flex justify-between items-center">
                                        <button
                                            class="text-left flex-1 font-semibold"
                                            on:click|preventDefault={() =>
                                                toggleExpansion(
                                                    prescription.id
                                                )}>
                                            <strong
                                                >{prescription.product
                                                    .name}</strong>
                                            ({prescription.product.type === 0
                                                ? "Rx"
                                                : "Non-Rx"})
                                        </button>
                                        <button
                                            class="bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded-xl"
                                            type="submit"
                                            on:click|preventDefault={() =>
                                                removePrescription(
                                                    prescription.id,
                                                    prescription.patient
                                                        .firstName +
                                                        " " +
                                                        prescription.patient
                                                            .lastName
                                                )}>
                                            Remove
                                        </button>
                                    </div>
                                    <!-- If the expanded set has the prescription id, its expanded so this html needs to be displayed to reflect is expanded nature -->
                                    {#if expandedPrescriptionIds.has(prescription.id)}
                                        <div class="text-left ml-4 space-y-1">
                                            <p>
                                                <strong>Quantity:</strong>
                                                {prescription.quantity}
                                            </p>
                                            <p>
                                                <strong>Period (Weeks):</strong>
                                                {prescription.period}
                                            </p>
                                            <p>
                                                <strong>Filled:</strong>
                                                {prescription.filled
                                                    ? "Yes"
                                                    : "No"}
                                            </p>
                                            <p>
                                                <strong>Price:</strong>
                                                ${(
                                                    prescription.product.price /
                                                    100
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    {/each}
                </ul>
                <!-- If there is no prescriptions matching a name then display none -->
            {:else}
                <p
                    class="border-2 border-neutral-400 rounded-lg px-2 py-1 w-full text-center">
                    No results found
                </p>
            {/if}
        </div>
    </div>
    <!-- This is the HTML for the new prescription form. This and the view prescriptions form can never be displayed at the same time -->
    <div
        id="newPrescription"
        class="w-full max-w-lg text-center flex flex-col gap-4 overflow-y-auto scroll flex-grow max-h-[calc(70vh-150px)] {formDisplayed
            ? 'visible'
            : 'hidden'}">
        {#if form?.errors && form?.errors.formKey == "createPrescription"}
            <p class="error text-red-500 mt-2">Please Fix The Errors Below:</p>
        {/if}

        <form method="POST" class="flex flex-col text-left items-center gap-4">
            <div class="w-full bg-cyan-50 p-2 rounded-3xl">
                {#if form?.errors?.patientID && form?.errors.formKey == "createPrescription"}
                    <p class="error text-red-500 mt-2">
                        {form?.errors.patientID}
                    </p>
                {/if}

                <label for="patient" class="text-left text-md mx-2 font-bold"
                    >Patient</label>
                <SearchableInput
                    items={serverPatients.map((patient) => {
                        let p = {
                            ...patient,
                            name: patient.firstName + " " + patient.lastName
                        };
                        return p;
                    })}
                    placeholder="Search Person By Name"
                    name="patient" />
            </div>
            <div class="w-full bg-cyan-50 p-2 rounded-3xl">
                {#if form?.errors?.productID && form?.errors.formKey == "createPrescription"}
                    <p class="error text-red-500 mt-2">
                        {form.errors.productID}
                    </p>
                {/if}
                <label for="product" class="text-left text-md mx-2 font-bold"
                    >Product</label>
                <SearchableInput
                    items={serverProducts}
                    placeholder="Search Drug By Name"
                    name="product" />
            </div>
            {#if form?.errors?.quantity && form?.errors.formKey == "createPrescription"}
                <p class="error text-red-500 mt-2">{form.errors.quantity}</p>
            {/if}
            <div class="w-full">
                <div class="flex flex-col mb-4 bg-cyan-50 p-2 rounded-3xl">
                    <label
                        for="quantity"
                        class="text-left text-md font-bold mb-2 mx-2"
                        >Number of Pills</label>
                    <input
                        class="border-2 border-neutral-400 rounded-xl px-2 py-1 mx-2"
                        id="quantity"
                        name="quantity"
                        autocomplete="off"
                        type="number"
                        bind:value={numPills}
                        required />
                </div>

                {#if form?.errors?.period && form?.errors.formKey == "createPrescription"}
                    <p class="error text-red-500 mb-2">{form.errors.period}</p>
                {/if}
                <div class="flex flex-col mb-4 bg-cyan-50 p-2 rounded-3xl">
                    <label
                        for="period"
                        class="text-left text-md font-bold mb-2 mx-2"
                        >Prescription Period (# of Weeks)</label>
                    <input
                        class="border-2 border-neutral-400 rounded-xl px-2 py-1 mx-2"
                        id="period"
                        name="period"
                        autocomplete="off"
                        type="number"
                        bind:value={period}
                        required />
                </div>
            </div>

            <div class="gap-4 w-3/4">
                <button
                    class="w-full bg-green-600 hover:bg-green-700 rounded-xl px-4 py-2 text-white"
                    type="submit">Submit</button>
            </div>
        </form>
    </div>
</main>
