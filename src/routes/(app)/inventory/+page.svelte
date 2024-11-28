<script lang="ts">
    import {fade} from "svelte/transition";
    import Medication from "$lib/components/medication.svelte";
    export let data;
    let inventory = data.inventory;
    let search: string = "";
</script>

<main in:fade={{delay: 400}} out:fade>
    <h1 class="text-center text-white text-5xl my-10">Inventory</h1>
    <div class="flex flex-col items-center">
        <a href="/addProduct">
            <button
                class="text-white text-lg rounded-lg px-4 py-1 bg-green-600 hover:bg-green-700"
                >Add New Product</button>
        </a>
        <input
            bind:value={search}
            placeholder="Search for Inventory"
            class="rounded-xl py-2 px-4 mt-4 mb-8 w-1/4 border-2 border-neutral-300 shadow-2xl" />
    </div>
    <div class="flex flex-col gap-4 mx-8 lg:mx-40">
        <div class="flex justify-between text-lg px-4 text-white">
            <span class="w-20 text-center">ID</span>
            <h1 class="text-lg text-center w-60">Medication</h1>
            <h2 class="w-24 text-center">In Stock</h2>
            <span class="inline-block w-40">Expiring</span>
            <span class="inline-block items-center justify-between w-48"></span>
        </div>
        <!-- These will eventually be looped through -->
        {#each inventory as product}
            {#if product.name.toLowerCase().match(search.toLowerCase())}
                <Medication medication={product} />
            {/if}
        {/each}
    </div>
</main>
