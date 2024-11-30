<script lang="ts">
    import type {CartEntry} from "$lib/types";
    import Icon from "@iconify/svelte";
    import {scale} from "svelte/transition";
    export let medication: CartEntry;
    let showAdd = false;
    let showRemove = false;
    let numChange: number;

    function toggleAdd() {
        showAdd = !showAdd;
        numChange = 0;
    }

    function toggleRemove() {
        showRemove = !showRemove;
        numChange = 0;
    }

    function checkRemoveQuantity() {
        if (numChange < 0) {
            numChange = 0;
        } else if (numChange > medication.totalQuantity) {
            numChange = medication.totalQuantity;
        }
    }

    function checkAddQuantity() {
        if (numChange < 0) {
            numChange = 0;
        }
    }
</script>

<div
    transition:scale
    class="flex justify-between items-center
bg-cyan-50 rounded-xl py-4 px-4">
    <span class="w-20 text-center">{medication.id}</span>
    <h1 class="text-lg text-center w-60">{medication.name}</h1>
    <h2 class="w-24 text-center">{medication.totalQuantity} in stock</h2>
    <div class="flex flex-col w-40">
        <span>{medication.numExpired} expired</span>
        <span>{medication.numExpiringSoon} expiring soon</span>
    </div>
    <div class="flex items-center justify-between w-48 text-white">
        <button
            class="bg-blue-400 px-6 py-1 rounded-xl
        hover:bg-cyan-400"
            on:click={toggleAdd}>Add</button>
        <button
            class="bg-red-400 px-4 py-1 rounded-xl
        hover:bg-red-500"
            on:click={toggleRemove}>Remove</button>
    </div>
</div>
{#if showAdd}
    <form
        transition:scale
        method="POST"
        action="/inventory?/add"
        class="absolute top-0 left-0 w-full h-screen flex justify-center items-center">
        <div
            class="flex flex-col gap-4 bg-cyan-50 w-1/2 h-1/2 rounded-3xl p-4 shadow-lg">
            <div class="flex justify-end">
                <button on:click={toggleAdd}>
                    <Icon
                        icon="carbon:close-filled"
                        class="text-3xl hover:text-red-500" />
                </button>
            </div>
            <h1 class="text-center text-4xl mb-4">
                Add {medication.name} to Inventory
            </h1>
            <div class="flex flex-col justify-center items-center">
                <h2 class="text-xl mb-2">
                    {medication.totalQuantity} in stock
                </h2>
                <span class="text-sm text-red-500"
                    >{medication.numExpired} expired</span>
                <span class="text-sm text-gray-800"
                    >{medication.numExpiringSoon} expiring soon</span>
            </div>
            <input name="productID" value={medication.id} class="hidden" />
            <div class="flex justify-center gap-2">
                <label for="quantity">Amount To add:</label>
                <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    class="border-2 border-gray-400 w-20 px-2"
                    bind:value={numChange}
                    on:change={checkAddQuantity} />
            </div>
            <div class="flex justify-center gap-2 mb-4">
                <label for="expirationDate">Expiration Date:</label>
                <input
                    id="expirationDate"
                    name="expirationDate"
                    type="date"
                    class="border-2 border-gray-400" />
            </div>
            <div class="flex flex-col items-center gap-2">
                <button
                    type="submit"
                    class="w-28 py-1 rounded-xl bg-blue-400 hover:bg-cyan-400"
                    >Add</button>
                <button
                    on:click={toggleAdd}
                    class="w-28 py-1 rounded-xl bg-red-500 hover:bg-red-400"
                    >Cancel</button>
            </div>
        </div>
    </form>
{/if}
{#if showRemove}
    <form
        transition:scale
        method="POST"
        action="/inventory?/remove"
        class="absolute top-0 left-0 w-full h-screen flex justify-center items-center">
        <div
            class="flex flex-col gap-4 bg-cyan-50 w-1/2 h-1/2 rounded-3xl p-4 shadow-lg">
            <div class="flex justify-end">
                <button on:click={toggleRemove}>
                    <Icon
                        icon="carbon:close-filled"
                        class="text-3xl hover:text-red-500" />
                </button>
            </div>
            <h1 class="text-center text-4xl mb-4">
                Remove {medication.name} from Inventory
            </h1>
            <div class="flex flex-col justify-center items-center">
                <h2 class="text-xl mb-2">
                    {medication.totalQuantity} in stock
                </h2>
                <span class="text-sm text-red-500"
                    >{medication.numExpired} expired</span>
                <span class="text-sm text-gray-800"
                    >{medication.numExpiringSoon} expiring soon</span>
            </div>
            <input name="productID" value={medication.id} class="hidden" />
            <div class="flex justify-center gap-2 mb-4">
                <label for="quantity">Amount To Remove:</label>
                <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    class="border-2 border-gray-400 px-2 w-20"
                    bind:value={numChange}
                    on:change={checkRemoveQuantity} />
            </div>
            <div class="flex flex-col items-center gap-2">
                <button
                    type="submit"
                    class="w-28 py-1 rounded-xl bg-blue-400 hover:bg-cyan-400"
                    >Remove</button>
                <button
                    on:click={toggleRemove}
                    class="w-28 py-1 rounded-xl bg-red-500 hover:bg-red-400"
                    >Cancel</button>
            </div>
        </div>
    </form>
{/if}
