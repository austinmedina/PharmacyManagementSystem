<script>
    import { onMount } from "svelte";
    let people = [];
    let patientDropdownVisible = false;
    let personInputValue = "";
    let personInputElement;

    // Event handler for clicks outside of the input/dropdown
    const handleClickOutside = (event) => {
        if (patientDropdownVisible && !personInputElement.contains(event.target)) {
        patientDropdownVisible = false;
        }
    };

    // Attach and detach the click listener for the document
    onMount(() => {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    });

    const peopleSearch = () => {
      people = [];
      people.push({'name':'Edward', 'id':'1'})
      // Function call to the database that returns a list of people names and their ids that will be hidden
    }


</script>


<div id="personInput" class="w-full">
    <input
      type="text"
      class="w-full border-2 border-neutral-300 rounded-lg px-2 py-1"
      placeholder="Search Patient By Name."
      autocomplete="off"
      id="peopleInput"
      bind:value={personInputValue}
      on:input={peopleSearch}
      bind:this={personInputElement}
      on:focus={() => {
        patientDropdownVisible = true;
        drugDropdownVisible = false;
      }}
    />
    {#if patientDropdownVisible && people.length > 0}
      <div class="dropdown visible mt-2">
        {#each people as person}
          <span hidden>{person.id}</span>
          <button class="w-full border-2 border-neutral-300 rounded-lg px-2 py-1 mb-1" on:click={() => personInputValue = person.name}>{person.name}</button>
        {/each}
      </div>
    {:else if patientDropdownVisible}
      <div class="dropdown visible mt-2">
        <p class="border-2 border-neutral-300 rounded-lg px-2 py-1">No results found</p>
      </div>
    {/if}
</div>