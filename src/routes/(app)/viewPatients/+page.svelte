<script lang="ts">
    import Patient from "$lib/components/patient.svelte";
    import type {PageData} from "./$types";
    import type {Patient as PatientType} from "$lib/types"; // Import the Patient type
    import {fade} from "svelte/transition";

    export let data: PageData;
    export let form;

    export let items: PatientType[] = data.patients; // Ensure items has a defined typeS
    let displayed: PatientType[]; // Explicitly define the type for displayed
    let inputValue = "";
    let message = form?.success;
    let formDisplayed =
        form?.errors && form?.errors.formKey == "createPatient" ? true : false;

    let firstName = form?.values?.firstName || "";
    let lastName = form?.values?.lastName || "";
    let dateOfBirth = form?.values?.dateOfBirth || "";
    let email = form?.values?.email || "";
    let phone = form?.values?.phone || "";
    let address = form?.values?.address || "";
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

<main
    class="flex flex-col items-center text-center"
    in:fade={{delay: 400}}
    out:fade>
    <div id="pageHeader">
        <h1 class="text-4xl my-4 text-white"><strong>View Patients</strong></h1>
        <button
            class="mb-6 rounded-xl bg-green-600 hover:bg-green-700 text-white py-1 px-4 text-xl"
            on:click|preventDefault={() => (formDisplayed = !formDisplayed)}>
            {formDisplayed ? "Return to Patient List" : "Create New Patient"}
        </button>
    </div>

    {#if message}
        <p class="success text-green-500 mb-4">{message}</p>
    {/if}

    <div
        id="viewPatients"
        class="w-full max-w-xl flex flex-col flex-grow gap-4 {formDisplayed
            ? 'hidden'
            : 'visible'}">
        <div id="allPatientSearch">
            <input
                type="text"
                class="w-3/4 border-2 border-neutral-400 rounded-3xl px-2 py-1"
                placeholder="Search By Paitent Name"
                autocomplete="off"
                bind:value={inputValue} />
        </div>
        <div
            id="patientDisplay"
            class="flex flex-col items-center gap-4 mb-4 w-full overflow-y-auto flex-grow max-h-[calc(70vh-200px)]">
            {#if displayed.length > 0}
                <ul class="p-4 space-y-2 w-full">
                    {#each displayed as item}
                        <Patient patient={item} {onPatientRemoved} {form} />
                    {/each}
                </ul>
            {:else}
                <p
                    class="border-2 border-neutral-400 rounded-lg px-2 py-1 w-full text-center">
                    No results found
                </p>
            {/if}
        </div>
    </div>

    <div
        id="newPatient"
        class="w-8/12 text-center flex flex-col gap-2 overflow-y-auto scroll flex-grow max-h-[calc(70vh-150px)] {formDisplayed
            ? 'visible'
            : 'hidden'}">
        {#if form?.errors && form?.errors.formKey == "createPatient"}
            <p class="error text-red-500 mt-2">Please Fix The Errors Below:</p>
        {/if}
        <form method="POST" class="flex flex-col items-center gap-4">
            <div class="flex flex-wrap w-full gap-y-4 gap-x-4">
                <div
                    class="flex flex-col w-[calc(50%-8px)] bg-cyan-50 rounded-3xl">
                    <label
                        for="fname"
                        class="text-left text-md font-bold mt-2 mb-1 mx-4"
                        >First Name</label>
                    {#if form?.errors?.firstName && form?.errors.formKey == "createPatient"}
                        <p class="text-red-500 text-sm">
                            {form.errors.firstName}
                        </p>
                    {/if}
                    <input
                        class="border-2 border-neutral-400 rounded-xl mx-4 mb-2 px-2 py-1"
                        id="fname"
                        name="firstName"
                        placeholder="Enter First Name"
                        autocomplete="off"
                        type="text"
                        bind:value={firstName}
                        required />
                </div>
                <div
                    class="flex flex-col w-[calc(50%-8px)] bg-cyan-50 rounded-3xl">
                    <label
                        for="lname"
                        class="text-left text-md font-bold mt-2 mb-1 mx-4"
                        >Last Name</label>
                    {#if form?.errors?.lastName && form?.errors.formKey == "createPatient"}
                        <p class="text-red-500 text-sm">
                            {form.errors.lastName}
                        </p>
                    {/if}
                    <input
                        class="border-2 border-neutral-400 rounded-xl mx-4 mb-2 px-2 py-1"
                        id="lname"
                        name="lastName"
                        placeholder="Enter Last Name"
                        autocomplete="off"
                        type="text"
                        bind:value={lastName}
                        required />
                </div>
                <div
                    class="flex flex-col w-[calc(50%-8px)] bg-cyan-50 rounded-3xl">
                    <label
                        for="dob"
                        class="text-left text-md font-bold mt-2 mb-1 mx-4"
                        >Date of Birth</label>
                    {#if form?.errors?.dateOfBirth && form?.errors.formKey == "createPatient"}
                        <p class="text-red-500 text-sm">
                            {form.errors.dateOfBirth}
                        </p>
                    {/if}
                    <input
                        class="border-2 border-neutral-400 rounded-xl mx-4 mb-2 px-2 py-1"
                        id="dob"
                        name="dateOfBirth"
                        placeholder="Select Date of Birth"
                        autocomplete="off"
                        type="date"
                        bind:value={dateOfBirth}
                        required />
                </div>
                <div
                    class="flex flex-col w-[calc(50%-8px)] bg-cyan-50 rounded-3xl">
                    <label
                        for="email"
                        class="text-left text-md font-bold mt-2 mb-1 mx-4"
                        >Email</label>
                    {#if form?.errors?.email && form?.errors.formKey == "createPatient"}
                        <p class="text-red-500 text-sm">{form.errors.email}</p>
                    {/if}
                    <input
                        class="border-2 border-neutral-400 rounded-xl mx-4 mb-2 px-2 py-1"
                        id="email"
                        name="email"
                        placeholder="Enter Email Address"
                        autocomplete="off"
                        type="email"
                        bind:value={email}
                        required />
                </div>
                <div
                    class="flex flex-col w-[calc(50%-8px)] bg-cyan-50 rounded-3xl">
                    <label
                        for="phone"
                        class="text-left text-md font-bold mt-2 mb-1 mx-4"
                        >Phone</label>
                    {#if form?.errors?.phone && form?.errors.formKey == "createPatient"}
                        <p class="text-red-500 text-sm">{form.errors.phone}</p>
                    {/if}
                    <input
                        class="border-2 border-neutral-400 rounded-xl mx-4 mb-2 px-2 py-1"
                        id="phone"
                        name="phone"
                        placeholder="Enter Phone Number"
                        autocomplete="off"
                        type="tel"
                        bind:value={phone}
                        required />
                </div>
                <div
                    class="flex flex-col w-[calc(50%-8px)] bg-cyan-50 rounded-3xl">
                    <label
                        for="address"
                        class="text-left text-md font-bold mt-2 mb-1 mx-4"
                        >Address</label>
                    {#if form?.errors?.address && form?.errors.formKey == "createPatient"}
                        <p class="text-red-500 text-sm">
                            {form.errors.address}
                        </p>
                    {/if}
                    <input
                        class="border-2 border-neutral-400 rounded-xl mx-4 mb-2 px-2 py-1"
                        id="address"
                        name="address"
                        placeholder="Enter Address"
                        autocomplete="off"
                        type="text"
                        bind:value={address}
                        required />
                </div>
            </div>
            <div
                class="flex mb-2 bg-cyan-50 p-2 rounded-3xl items-center justify-between">
                <label for="insurance" class="text-md font-bold ml-4 mr-2">
                    Insurance
                </label>
                <div class="flex flex-col items-end">
                    {#if form?.errors?.insurance && form?.errors.formKey == "createPatient"}
                        <p class="text-red-500 text-sm">
                            {form.errors.insurance}
                        </p>
                    {/if}
                    <input
                        class="border-2 border-neutral-400 rounded-lg px-2 py-1 mr-4"
                        id="insurance"
                        name="insurance"
                        type="checkbox"
                        bind:checked={insurance} />
                </div>
            </div>
            <button
                class=" w-4/12 bg-green-600 hover:bg-green-700 rounded-xl px-4 py-2 text-white"
                type="submit">Submit</button>
        </form>
    </div>
</main>
