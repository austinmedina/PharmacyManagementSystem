<script lang="ts">
    import Prescription from "$lib/components/prescription.svelte";
    import {fade} from "svelte/transition";
    import type {PageData} from "./$types";

    export let data: PageData;

    let selected: number | null;
</script>

<main class="container mx-auto px-4" in:fade={{delay: 400}} out:fade>
    {#each data.prescriptions as prescription}
        <form method="POST" action="?/fill">
            <div
                class="w-8/12 mx-auto flex flex-row bg-neutral-100 p-4 mb-2 rounded-3xl">
                {#if selected && selected == prescription.id}
                    <button
                        class="text-center flex-grow"
                        on:click={() => (selected = null)}>
                        <Prescription data={prescription} />
                    </button>
                {:else}
                    <button
                        class="flex-grow text-center"
                        on:click={() => (selected = prescription.id)}>
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
                    </button>
                {/if}
                <input
                    hidden
                    name="prescriptionID"
                    bind:value={prescription.id} />
                <button class="justify-end rounded-3xl bg-blue-300 w-16 h-10"
                    >Fill</button>
            </div>
        </form>
    {/each}
</main>
