<script lang="ts">
    import Medication from "$lib/components/medication.svelte";
    export let data;
    let inventory = data.inventory;
</script>

<main>
    <h1 class="text-center text-white text-5xl my-10">Inventory</h1>
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
            <Medication medication={product} />
        {/each}
    </div>
</main>
