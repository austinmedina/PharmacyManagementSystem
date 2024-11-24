<script lang="ts">
    import type {PageData} from "./$types";
    import {LogType} from "$lib/types";
    import {fade} from "svelte/transition";

    export let data: PageData;
    let form: HTMLFormElement | null;
    let selected: number | null;
    // console.log(data);
</script>

<main class="container mx-auto px-4 py-4" in:fade={{delay: 400}} out:fade>
    <h3 class="text-2xl text-center">Logs</h3>
    <div class="flex justify-center py-2">
        <form bind:this={form} action="/logs">
            <label for="type">Log type:</label>
            <select name="type" on:change={() => form?.requestSubmit()}>
                {#each [...Array(Object.keys(LogType).length / 2).keys()] as type}
                    <option value={type}>{LogType[type]}</option>
                {/each}
            </select>
        </form>
    </div>
    <div>
        <ul>
            {#each data.logs as log, i}
                <li>
                    {#if selected !== null && selected == i}
                        <button
                            on:click={() => (selected = null)}
                            class="w-8/12 mx-auto flex flex-col bg-neutral-100 p-4 mb-2 rounded-3xl">
                            <div class="flex flex-row">
                                {log.time}
                                {#if data.type == LogType.Fill}
                                    <!-- TODO: fill in actual data -->
                                    <div class="mx-4">Filled Prescription</div>
                                {/if}
                            </div>
                            <div>
                                ID: 0 <br />
                                PharmacistID: 1 <br />
                                PrescriptionID: 6 <br />
                            </div>
                        </button>
                    {:else}
                        <button
                            on:click={() => (selected = i)}
                            class="w-8/12 mx-auto flex flex-row bg-neutral-100 p-4 mb-2 rounded-3xl">
                            {log.time}
                            {#if data.type == LogType.Fill}
                                <!-- TODO: fill in actual data -->
                                <div class="mx-4">Filled Prescription</div>
                            {/if}
                        </button>
                    {/if}
                </li>
            {/each}
        </ul>
    </div>
</main>
