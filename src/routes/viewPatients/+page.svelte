<script lang="ts">
    import Patient from "$lib/components/patient.svelte";
    import type {PageData} from "./$types";
    import type {Patient as PatientType} from "$lib/types"; // Import the Patient type

    export let data: PageData;
    export let form;

    export let items: PatientType[] = data.patients; // Ensure items has a defined type
    export let placeholder;
    let displayed: PatientType[]; // Explicitly define the type for displayed
    let inputValue = "";
    let message = "";
    let formDisplayed = form?.errors ? true : false;

    let firstName = form?.values?.firstName || "";
    let lastName = form?.values?.lastName || "";
    let dateOfBirth = form?.values?.dateOfBirth || "";
    let email = form?.values?.email || "";
    let phone = form?.values?.phone || "";
    let insurance = form?.values?.insurance || false;

    const search = (
        items: PatientType[],
        inputValue: string
    ): PatientType[] => {
        displayed = items;
        if (inputValue !== "") {
            displayed = displayed.filter((item) => {
                const patientName = item.firstName + " " + item.lastName;
                return patientName
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
            });
        }
        return displayed;
    };

    interface PatientResponse {
        patients: PatientType[]; // Define the expected shape of the response
    }

    const onPatientRemoved = async (patientName: string) => {
        message = `Successfully removed ${patientName}`;
        const response = await fetch("/api/patient", {
            method: "GET"
        });
        if (response.ok) {
            const data: PatientResponse = await response.json(); // Specify the type of data
            items = data.patients; // Update the patient list with the latest data
        } else {
            console.error("Failed to fetch patients");
        }
    };

    $: displayed = search(items, inputValue);
</script>

<main class="flex flex-col items-center text-center">
    <div id="pageHeader">
        <h1 class="text-3xl my-8">View Patients</h1>
        <button
            class="mb-6 rounded-xl bg-blue-600 hover:bg-green-700 text-white py-1 px-4 text-xl"
            on:click={() => (formDisplayed = !formDisplayed)}>
            {formDisplayed ? "Return to Patient List" : "Create New Patient"}
        </button>
    </div>

    {#if message}
        <p class="success text-green-500 mb-4">{message}</p>
    {/if}
    {#if form?.success}
        <p class="success text-green-500 mb-4">{form.success}</p>
    {/if}

    <div
        id="viewPatients"
        class="w-full max-w-md flex flex-col flex-grow gap-4 {formDisplayed
            ? 'hidden'
            : 'visible'}">
        <div id="allPatientSearch">
            <input
                type="text"
                class="w-full border-2 border-neutral-300 rounded-lg px-2 py-1"
                {placeholder}
                autocomplete="off"
                bind:value={inputValue} />
        </div>
        <div
            id="patientDisplay"
            class="flex flex-col items-center gap-4 mb-4 w-full overflow-y-auto flex-grow max-h-[calc(70vh-200px)]">
            {#if displayed.length > 0}
                <ul class="p-4 space-y-2 w-full">
                    {#each displayed as item}
                        <Patient patient={item} {onPatientRemoved} />
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
        id="newPatient"
        class="w-full max-w-md text-center flex flex-col gap-4 {formDisplayed
            ? 'visible'
            : 'hidden'}">
        {#if form?.errors}
            <p class="error text-red-500 mt-2">Please Fix The Errors Below:</p>
        {/if}
        <form method="POST" class="flex flex-col items-center gap-2">
            <div
                class="flex flex-col mb-2 w-full bg-green-200 border-black border rounded-xl p-2">
                <label for="fname" class="text-left text-md font-bold"
                    >First Name</label>
                <input
                    class="border-2 border-neutral-300 rounded-lg px-2 py-1 w-full mt-2"
                    id="fname"
                    name="firstName"
                    placeholder="Enter first name"
                    autocomplete="off"
                    type="text"
                    bind:value={firstName}
                    required />
                {#if form?.errors?.firstName}
                    <p class="text-red-500 text-sm">{form.errors.firstName}</p>
                {/if}
            </div>
            <div
                class="flex flex-col mb-2 w-full bg-green-200 border-black border rounded-xl p-2">
                <label for="lname" class="text-left text-md font-bold"
                    >Last Name</label>
                <input
                    class="border-2 border-neutral-300 rounded-lg px-2 py-1 w-full mt-2"
                    id="lname"
                    name="lastName"
                    placeholder="Enter last name"
                    autocomplete="off"
                    type="text"
                    bind:value={lastName}
                    required />
                {#if form?.errors?.lastName}
                    <p class="text-red-500 text-sm">{form.errors.lastName}</p>
                {/if}
            </div>
            <div
                class="flex flex-col mb-2 w-full bg-green-200 border-black border rounded-xl p-2">
                <label for="dob" class="text-left text-md font-bold"
                    >Date of Birth</label>
                <input
                    class="border-2 border-neutral-300 rounded-lg px-2 py-1 w-full mt-2"
                    id="dob"
                    name="dateOfBirth"
                    placeholder="Select date of birth"
                    autocomplete="off"
                    type="date"
                    bind:value={dateOfBirth}
                    required />
                {#if form?.errors?.dateOfBirth}
                    <p class="text-red-500 text-sm">
                        {form.errors.dateOfBirth}
                    </p>
                {/if}
            </div>
            <div
                class="flex flex-col mb-2 w-full bg-green-200 border-black border rounded-xl p-2">
                <label for="email" class="text-left text-md font-bold"
                    >Email</label>
                <input
                    class="border-2 border-neutral-300 rounded-lg px-2 py-1 w-full mt-2"
                    id="email"
                    name="email"
                    placeholder="Enter email address"
                    autocomplete="off"
                    type="email"
                    bind:value={email}
                    required />
                {#if form?.errors?.email}
                    <p class="text-red-500 text-sm">{form.errors.email}</p>
                {/if}
            </div>
            <div
                class="flex flex-col mb-2 w-full bg-green-200 border-black border rounded-xl p-2">
                <label for="phone" class="text-left text-md font-bold"
                    >Phone</label>
                <input
                    class="border-2 border-neutral-300 rounded-lg px-2 py-1 w-full mt-2"
                    id="phone"
                    name="phone"
                    placeholder="Enter phone number"
                    autocomplete="off"
                    type="tel"
                    bind:value={phone}
                    required />
                {#if form?.errors?.phone}
                    <p class="text-red-500 text-sm">{form.errors.phone}</p>
                {/if}
            </div>
            <div
                class="flex mb-2 w-full bg-green-200 border-black border rounded-xl p-2 gap-3 items-center">
                <label for="insurance" class="text-left text-md font-bold"
                    >Insurance</label>
                <input
                    class="border-2 border-neutral-300 rounded-lg px-2 py-1"
                    id="insurance"
                    name="insurance"
                    type="checkbox"
                    bind:checked={insurance} />

                {#if form?.errors?.insurance}
                    <p class="text-red-500 text-sm">{form.errors.insurance}</p>
                {/if}
            </div>
            <button
                type="submit"
                class="bg-blue-500 hover:bg-green-500 text-white px-4 py-2 rounded-lg">
                Submit
            </button>
        </form>
    </div>
</main>
