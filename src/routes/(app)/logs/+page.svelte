<script lang="ts">
    import type {PageData} from "./$types";
    import {fade} from "svelte/transition";
    import {InventoryAction, Log, LogType} from "$lib/types";

    export let data: PageData;
    let form: HTMLFormElement | null;
    let selected: number | null;
</script>

<main class="container mx-auto px-4 py-4" in:fade={{delay: 400}} out:fade>
    <h2 class="text-3xl text-center font-bold">Logs</h2>
    <div class="flex mx-auto my-2 w-60 justify-center py-2 rounded-xl bg-white">
        <form bind:this={form} action="/logs">
            <label for="type">Log type:</label>
            <select
                class="rounded-xl w-28 text-center bg-cyan-300"
                name="type"
                on:change={() => {
                    form?.requestSubmit();
                    selected = null;
                }}>
                {#each [...Array(Object.keys(LogType).length / 2).keys()] as type}
                    <option value={type}>{LogType[type]}</option>
                {/each}
            </select>
        </form>
    </div>
    <div>
        <ul>
            {#each data.logs.reverse() as log, i}
                <li>
                    <button
                        on:click={() => (selected = selected === i ? null : i)}
                        class="w-8/12 mx-auto flex flex-col bg-neutral-100 p-4 mb-2 rounded-xl">
                        <div class="flex flex-row mx-4">
                            {#if log.type == LogType.Fill}
                                <div class="mr-4">
                                    {log.name} filled prescription for {log.patient}
                                </div>
                            {:else if log.type == LogType.LogLog}
                                <div class="mr-4">
                                    {log.name} logged {log.action == Log.In
                                        ? "in"
                                        : "out"}
                                </div>
                            {:else if log.type == LogType.Purchase}
                                <div class="mr-4">
                                    {log.quantity}x {log.name} purchased for ${log.totalPrice}
                                </div>
                            {:else if log.type == LogType.Inventory}
                                <div class="mr-4">
                                    {log.quantity}x {log.name}
                                    {log.action == InventoryAction.In
                                        ? "entered"
                                        : "left"} inventory
                                </div>
                            {/if}
                            <div class="text-right grow">
                                {log.time.toLocaleString("en-US")}
                            </div>
                        </div>
                        {#if selected !== null && selected == i}
                            {#if log.type == LogType.Fill}
                                <div class="flex flex-row">
                                    <div class="mx-4 my-2 grow">
                                        <h5>Employee ID</h5>
                                        <p>{log.userID}</p>
                                    </div>
                                    <div class="mx-4 my-2 grow">
                                        <h5>Prescription ID</h5>
                                        <p>{log.prescriptionID}</p>
                                    </div>
                                    <div class="mx-4 my-2 grow">
                                        <h5>Patient ID</h5>
                                        <p>{log.patientID}</p>
                                    </div>
                                </div>
                            {:else if log.type == LogType.LogLog}
                                <div class="flex flex-row">
                                    <div class="mx-4 my-2 grow">
                                        <h5>Employee ID</h5>
                                        <p>{log.userID}</p>
                                    </div>
                                </div>
                            {:else if log.type == LogType.Purchase}
                                <div class="flex flex-row">
                                    <div class="mx-4 my-2 grow">
                                        <h5>Item ID</h5>
                                        <p>{log.itemID}</p>
                                    </div>
                                    <div class="mx-4 my-2 grow">
                                        <h5>Cart ID</h5>
                                        <p>{log.cartID}</p>
                                    </div>
                                </div>
                            {:else if log.type == LogType.Inventory}
                                <div class="flex flex-row">
                                    <div class="mx-4 my-2 grow">
                                        <h5>Product ID</h5>
                                        <p>{log.productID}</p>
                                    </div>
                                </div>
                            {/if}
                        {/if}
                    </button>
                </li>
            {/each}
        </ul>
        {#if data.logs.length == 0}
            <p class="text-center">No logs of this type available</p>
        {/if}
    </div>
</main>
