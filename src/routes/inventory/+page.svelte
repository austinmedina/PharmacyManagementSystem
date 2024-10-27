<script lang="ts">
    import Icon from "@iconify/svelte";
    import Medication from "$lib/components/medication.svelte";
    export let data;
    let inventory = data.inventory;
    let showNotification = false;

    function checkExpired() {
        for (let i = 0; i < inventory.length; i++) {
            if ((inventory[i].numExpired as number) > 0) {
                return true;
            }
        }
    }

    function getExpired() {
        let expired = [];
        for (let i = 0; i < inventory.length; i++) {
            if ((inventory[i].numExpired as number) > 0) {
                expired.push(inventory[i]);
            }
        }
        return expired;
    }

    function toggleNotification() {
        showNotification = !showNotification;
    }
</script>

<main>
    <!-- Only one of these icons will be shown at a time -->
    <div class="flex justify-end">
        <div class="flex flex-col items-end text-white">
            <button on:click={toggleNotification}>
                {#if checkExpired()}
                    <Icon
                        icon="material-symbols-light:notifications-active-rounded"
                        class="text-5xl hover:text-red-400" />
                {:else}
                    <Icon
                        icon="material-symbols-light:notifications-rounded"
                        class="text-5xl hover:text-purple-400" />
                {/if}
            </button>
            {#if showNotification}
                <div class="flex flex-col gap-2">
                    {#each getExpired() as item}
                        <span
                            >{item.name} has {item.numExpired} expired medications</span>
                    {/each}
                </div>
            {/if}
        </div>
    </div>

    <h1 class="text-center text-white text-5xl mb-10">Inventory</h1>
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
