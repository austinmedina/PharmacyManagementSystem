<script lang="ts" generics="T extends Searchable">
    /*
    The following code creates a reusable input that reduces the HTML needed in the program.
    It creats a input box that allows you to search for a given item in the items list fed into the component
    */
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
        // Filters the list of items given to the component and sets the displayed items to those matching the search input
    };

    $: displayed = search(items, inputValue);
</script>

<div id="search" class="w-full mr-2 mb-2 px-2">
    <!-- Displays a search bar, and if the user is clicked on the input, will display the items matching the search -->
    <input
        class="w-full border-2 border-neutral-400 rounded-xl px-2 py-1"
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
                        class="w-full border-2 border-neutral-400 rounded-xl px-2 py-1 mb-1"
                        on:mousedown={() => {
                            inputValue = item.name;
                            resultID = item.id;
                        }}>{item.name}</button>
                {/each}
            </ul>
        </div>
    {:else if dropdownVisible}
        <div class="dropdown visible mt-2">
            <p class="border-2 border-neutral-400 rounded-xl px-2 py-1">
                No results found
            </p>
        </div>
    {/if}
</div>
