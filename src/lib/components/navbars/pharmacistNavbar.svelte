<!-- Pharmacist -->
<script lang="ts">
    import type {CartEntry} from "$lib/types";
    import Icon from "@iconify/svelte";

    export let inventory: CartEntry[] | undefined;
    let showMenu = false;
    let showNotification = false;
    let expired = [];
    let lowStock = [];

    if (inventory != undefined) {
        for (let i = 0; i < inventory.length; i++) {
            if ((inventory[i].numExpired as number) > 0) {
                expired.push(inventory[i]);
            }
            if ((inventory[i].totalQuantity as number) < 120) {
                lowStock.push(inventory[i]);
            }
        }
    }
</script>

<nav class="flex justify-between p-8 mt-6 bg-white shadow-2xl">
    <h1>Insert LOGO HERE</h1>
    <div class="flex justify-evenly gap-8">
        <a
            href="/viewPatients"
            class="px-6 py-1 rounded-2xl hover:bg-blue-400 hover:text-white"
            >View Patients</a>
        <a
            href="/fulfill"
            class="px-6 py-1 rounded-2xl hover:bg-blue-400 hover:text-white"
            >Fulfill Prescriptions</a>
        <a
            href="/prescriptions"
            class="px-6 py-1 rounded-2xl hover:bg-blue-400 hover:text-white"
            >View Prescriptions</a>
        <a
            href="/inventory"
            class="px-6 py-1 rounded-2xl hover:bg-blue-400 hover:text-white"
            >Inventory</a>
        <a
            href="/reports"
            class="px-6 py-1 rounded-2xl hover:bg-blue-400 hover:text-white"
            >Reports</a>
        <a
            href="/logs"
            class="px-6 py-1 rounded-2xl hover:bg-blue-400 hover:text-white"
            >Logs</a>
    </div>
    <div class="flex justify-center gap-2">
        <div class="flex flex-col items-end text-black">
            <button
                on:click={() => {
                    showNotification = !showNotification;
                }}>
                {#if expired.length > 0}
                    <Icon
                        icon="material-symbols-light:notifications-active-rounded"
                        class="text-4xl hover:text-cyan-400" />
                {:else}
                    <Icon
                        icon="material-symbols-light:notifications-rounded"
                        class="text-4xl hover:text-cyan-400" />
                {/if}
            </button>
            {#if showNotification}
                <div
                    class="absolute top-24 right-0 bg-white w-96 max-h-60 overflow-auto py-2 mt-2 rounded-lg shadow-xl">
                    <div class="flex flex-col text-center">
                        {#each expired as item}
                            <span class="text-red-600 py-2 hover:bg-gray-200"
                                >{item.name} has {item.numExpired} expired medications</span>
                        {/each}
                        {#each lowStock as item}
                            <span class="text-yellow-600 py-2 hover:bg-gray-200"
                                >{item.name} is low in stock ({item.totalQuantity}
                                remaining)</span>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
        <button
            class="focus:outline-none"
            on:click={() => (showMenu = !showMenu)}>
            <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 11c2.76 0 5-2.24 5-5S14.76 1 12 1 7 3.24 7 6s2.24 5 5 5zM2 20a10 10 0 0 1 20 0H2z"
                ></path>
            </svg>
        </button>
        {#if showMenu}
            <div
                class="absolute top-24 right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl">
                <a
                    href="/profile"
                    class="block px-4 py-2 text-gray-800 hover:bg-blue-400 hover:text-white"
                    >Profile</a>
                <form
                    method="post"
                    action="/logout?/logout"
                    class="block px-4 py-2">
                    <button
                        class="w-full text-left text-gray-800 hover:bg-blue-400 hover:text-white"
                        >Logout</button>
                </form>
            </div>
        {/if}
    </div>
</nav>
