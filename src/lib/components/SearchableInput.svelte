<script lang="ts" generics="T extends Searchable">
    import type {Searchable} from "$lib/types";

    export let items: T[];
    export let placeholder: string;
    export let name: string;
    let displayed: T[];
    let dropdownVisible = false;
    let inputValue = "";
    let resultID: number;

    const search = (items: T[], inputValue: string) => {
        displayed = items;
        if (inputValue != "") {
            displayed = displayed.filter((item) => {
                return item.name.toLowerCase().match(inputValue.toLowerCase());
            });
        }
        return displayed;
        // Function call to the database that returns a list of people names and their ids that will be hidden
    };

    $: displayed = search(items, inputValue);
</script>

<div id="search" class="w-full">
    <input
        class="w-full border-2 border-neutral-300 rounded-lg px-2 py-1"
        {placeholder}
        autocomplete="off"
        bind:value={inputValue}
        on:focus={() => {
            dropdownVisible = true;
        }}
        on:blur={() => {
            dropdownVisible = false;
        }}
        required />
    <input hidden name={name + "ID"} bind:value={resultID} />
    {#if dropdownVisible && displayed.length > 0}
        <div class="dropdown visible mt-2 max-h-48 overflow-y-auto">
            <ul class="p-4 space-y-2">
                {#each displayed as item}
                    <button
                        class="w-full border-2 border-neutral-300 rounded-lg px-2 py-1 mb-1"
                        on:mousedown={() => {
                            inputValue = item.name;
                            resultID = item.id;
                        }}>{item.name}</button>
                {/each}
            </ul>
        </div>
    {:else if dropdownVisible}
        <div class="dropdown visible mt-2">
            <p class="border-2 border-neutral-300 rounded-lg px-2 py-1">
                No results found
            </p>
        </div>
    {/if}
</div>
