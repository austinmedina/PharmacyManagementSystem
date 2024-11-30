<script lang="ts">
    import {fade} from "svelte/transition";
    import type {PageData} from "./$types";

    export let data: PageData;

    let selected: number | null;
</script>

<main class="container mx-auto px-4" in:fade={{delay: 400}} out:fade>
    <h2 class="m-4 text-center text-3xl font-bold">Prescriptions</h2>
    {#each data.prescriptions as prescription, i}
        <form method="POST" action="?/fill">
            <div
                class="w-8/12 mx-auto flex flex-row bg-neutral-100 p-4 mb-2 rounded-3xl">
                <button
                    type="button"
                    class="text-center flex-grow"
                    on:click={() => (selected = selected === i ? null : i)}>
                    <p class="text-lg">
                        {prescription.patient.firstName +
                            " " +
                            prescription.patient.lastName}
                    </p>
                    <p class="text-sm">
                        {prescription.quantity +
                            "x " +
                            prescription.product.name}
                    </p>
                    {#if selected !== null && selected == i}
                        <div class="flex flex-row">
                            <div class="mx-4 my-2 grow">
                                <h5>Prescription ID</h5>
                                <p>{prescription.id}</p>
                            </div>
                            <div class="mx-4 my-2 grow">
                                <h5>Drug ID</h5>
                                <p>{prescription.product.id}</p>
                            </div>
                        </div>
                    {/if}
                </button>
                <input
                    hidden
                    name="prescriptionID"
                    bind:value={prescription.id} />
                <button class="justify-end rounded-3xl bg-blue-300 w-16 h-10"
                    >Fill</button>
            </div>
        </form>
    {/each}
    {#if data.prescriptions.length == 0}
        <p class="text-center">No unfilled prescriptions remaining</p>
    {/if}
</main>
