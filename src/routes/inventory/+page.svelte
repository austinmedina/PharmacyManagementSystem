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
        <div class="flex flex-col items-end">
            <button on:click={toggleNotification}>
                {#if checkExpired()}
                    <Icon
                        icon="material-symbols-light:notifications-active-rounded"
                        class="text-5xl hover:text-purple-400" />
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

    <h1 class="text-center text-3xl mb-4">Inventory</h1>
    <div class="flex flex-col gap-4 mx-8">
        <div class="flex justify-around text-lg">
            <h2><strong>ID</strong></h2>
            <h2><strong>Medication</strong></h2>
            <h2><strong>In stock</strong></h2>
            <span class="w-12"></span>
            <span class="w-12"></span>
        </div>
        <!-- These will eventually be looped through -->
        {#each inventory as product}
            <Medication medication={product} />
        {/each}
    </div>
</main>
