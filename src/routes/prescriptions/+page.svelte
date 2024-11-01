<script lang="ts">
    import type {PageData} from "./$types";
    import SearchableInput from "$lib/components/SearchableInput.svelte";

    export let data: PageData;

    import type {
        Prescription as PrescriptionType,
        Patient as PatientType,
        Product as ProductType
    } from "$lib/types";
    export let form;

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
    export let placeholder;
    let displayed: {[key: number]: PrescriptionType[]} = {}; // Explicitly define the type for displayed
    let inputValue = "";
    let message = form?.success;
    let formDisplayed =
        form?.errors && form?.errors.formKey == "createPrescription"
            ? true
            : false;

    let numPills: number;
    let period: number;

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

    $: displayed = search(serverPrescriptions, inputValue);
</script>

<main class="flex flex-col items-center text-center">
    <div id="pageHeader">
        <h1 class="text-3xl my-8">View Prescriptions</h1>
        <button
            class="mb-6 rounded-xl bg-blue-600 hover:bg-green-700 text-white py-1 px-4 text-xl"
            on:click|preventDefault={() => (formDisplayed = !formDisplayed)}>
            {formDisplayed
                ? "Return to Prescription List"
                : "Create New Prescription"}
        </button>
    </div>

    {#if message}
        <p class="success text-green-500 mb-4">{message}</p>
    {/if}

    <div
        id="viewPrescriptions"
        class="w-full max-w-lg flex flex-col flex-grow gap-4 {formDisplayed
            ? 'hidden'
            : 'visible'}">
        <div id="allPrescriptionSearch">
            <input
                type="text"
                class="w-full border-2 border-neutral-300 rounded-lg px-2 py-1"
                {placeholder}
                autocomplete="off"
                bind:value={inputValue} />
        </div>
        <div
            id="prescriptionDisplay"
            class="flex flex-col items-center gap-4 mb-4 w-full overflow-y-auto flex-grow max-h-[calc(70vh-200px)]">
            {#if Object.keys(displayed).length > 0}
                <ul class="p-4 space-y-2 w-full">
                    {#each Object.entries(displayed) as [key, value]}
                        <div class="bg-neutral-200 p-4 rounded-3xl space-y-4">
                            <h2 class="text-xl font-semibold">
                                {value[0].patient.firstName +
                                    " " +
                                    value[0].patient.lastName}
                            </h2>

                            {#each value as prescription, index}
                                <div class="border-b pb-2">
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
                                            class="bg-purple-500 hover:bg-red-700 text-white py-1 px-4 rounded-xl"
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
                                    {#if expandedPrescriptionIds.has(prescription.id)}
                                        <div class="mt-2 ml-4 space-y-1">
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
            {:else}
                <p
                    class="border-2 border-neutral-300 rounded-lg px-2 py-1 w-full text-center">
                    No results found
                </p>
            {/if}
        </div>
    </div>
    <div
        id="newPrescription"
        class="w-full max-w-md text-center flex flex-col gap-4 {formDisplayed
            ? 'visible'
            : 'hidden'}">
        {#if form?.errors && form?.errors.formKey == "createPrescription"}
            <p class="error text-red-500 mt-2">Please Fix The Errors Below:</p>
        {/if}

        <form method="POST" class="flex flex-col items-center gap-4">
            {#if form?.errors?.patientID && form?.errors.formKey == "createPrescription"}
                <p class="error text-red-500 mt-2">{form?.errors.patientID}</p>
            {/if}
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

            {#if form?.errors?.productID && form?.errors.formKey == "createPrescription"}
                <p class="error text-red-500 mt-2">{form.errors.productID}</p>
            {/if}
            <SearchableInput
                items={serverProducts}
                placeholder="Search Drug By Name"
                name="product" />

            {#if form?.errors?.quantity && form?.errors.formKey == "createPrescription"}
                <p class="error text-red-500 mt-2">{form.errors.quantity}</p>
            {/if}
            <div class="w-full">
                <div class="flex flex-col mb-4">
                    <label for="quantity">Number of Pills</label>
                    <input
                        class="border-2 border-neutral-300 rounded-lg px-2 py-1"
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
                <div class="flex flex-col mb-4">
                    <label for="period">Prescription Period (# of Weeks)</label>
                    <input
                        class="border-2 border-neutral-300 rounded-lg px-2 py-1"
                        id="period"
                        name="period"
                        autocomplete="off"
                        type="number"
                        bind:value={period}
                        required />
                </div>
            </div>

            <div class="w-full">
                <button
                    class="w-full bg-black text-white rounded-lg px-4 py-2"
                    type="submit">Submit</button>
            </div>
        </form>
    </div>
</main>
