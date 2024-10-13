<script lang="ts">
    import type {PageData, ActionData} from "./$types";
    import SearchableInput from "$lib/components/SearchableInput.svelte";
    import Patient from "$lib/components/patient.svelte";

    export let data: PageData;
    export let form: ActionData;
</script>

<main class="flex justify-center mt-10">
    <div class="w-full max-w-md text-center flex flex-col gap-4">
        <h1 class="text-xl mb-4">Enter A New Prescription</h1>

        {#if form?.success}
            <p class="success text-green-500 mb-4">{form.success}</p>
        {:else if form?.errors}
            <p class="error text-red-500 mt-2">Please Fix The Errors Below:</p>
        {/if}

        <form method="POST" class="flex flex-col items-center gap-4">
            {#if form?.errors?.patientID}
                <p class="error text-red-500 mt-2">{form?.errors.patientID}</p>
            {/if}
            <SearchableInput
                items={data.patients.map((patient) => {
                    let p = {
                        ...patient,
                        name: patient.firstName + " " + patient.lastName
                };
                    return p;
                })}
                placeholder="Search Person By Name"
                name="patient" />

            {#if form?.errors?.productID}
                <p class="error text-red-500 mt-2">{form.errors.productID}</p>
            {/if}
            <SearchableInput
                items={data.products}
                placeholder="Search Drug By Name"
                name="product" />

            {#if form?.errors?.quantity}
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
                        required />
                </div>

                {#if form?.errors?.period}
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
