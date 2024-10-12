<script lang="ts">
    export let items;
    export let placeholder;
    let displayed;
    let dropdownVisible = false;
    let inputValue = "";
    let patientID : number;

    const search = (items, inputValue) => {
    displayed = items;
    if (inputValue !== "") {
      displayed = displayed.filter((item) => {
        const patientName = item.firstName + ' ' + item.lastName;
        return patientName.toLowerCase().includes(inputValue.toLowerCase());
      });
    }
    return displayed;
  }


    $: displayed = search(items, inputValue);
</script>

<div id="search" class="w-full">
    <input
      type="text"
      class="w-full border-2 border-neutral-300 rounded-lg px-2 py-1"
      placeholder={ placeholder }
      autocomplete="off"
      bind:value={inputValue}
      on:focus={() => {
        dropdownVisible = true;
      }}
      on:blur={() => {
        dropdownVisible = false;
      }}
      required
    />
    <input hidden name="patientID" bind:value={ patientID }>
    {#if dropdownVisible && displayed.length > 0}
      <div class="dropdown visible mt-2 max-h-48 overflow-y-auto">
        <ul class="p-4 space-y-2">
          {#each displayed as item}
            <button 
              class="w-full border-2 border-neutral-300 rounded-lg px-2 py-1 mb-1" 
              on:mousedown={() => { 
                inputValue = item.firstName + ' ' + item.lastName, 
                patientID = item.id
              }}>
            { item.firstName + ' ' + item.lastName }
            </button>
          {/each}
        </ul>
      </div>
    {:else if dropdownVisible}
      <div class="dropdown visible mt-2">
        <p class="border-2 border-neutral-300 rounded-lg px-2 py-1">No results found</p>
      </div>
    {/if}
</div>