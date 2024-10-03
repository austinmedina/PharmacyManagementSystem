<script>
    import { onMount } from "svelte";
    import PeopleSearch from "$lib/components/peopleSearch.svelte";

    
    let drugDropdownVisible = false;
    
    let drugInputValue = "";
    
    let drugInputElement;
    
    let drugs = [];
  
    // Event handler for clicks outside of the input/dropdown
    const handleClickOutside = (event) => {
    if (patientDropdownVisible && !personInputElement.contains(event.target)) {
      patientDropdownVisible = false;
    }
    if (drugDropdownVisible && !drugInputElement.contains(event.target)) {
      drugDropdownVisible = false;
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
  
    const drugSearch = () => {
      drugs = [];
      drugs.push({'name':'Advil', 'id':'1'}) // Function call to the database that returns a list of drug names and their ids that will be hidden
    }
  </script>
  
  <main class="flex justify-center mt-10">
    <div class="w-full max-w-md text-center flex flex-col gap-4">
      <h1 class="text-xl mb-4">Enter A New Prescription</h1>
  
      <form method="POST" class="flex flex-col items-center gap-4">
        

        <div id="drugTypeInput" class="w-full">
          <input
            type="text"
            class="w-full border-2 border-neutral-300 rounded-lg px-2 py-1"
            placeholder="Search Drug By Name."
            autocomplete="off"
            id="drugInput"
            bind:value={drugInputValue}
            on:input={drugSearch}
            bind:this={drugInputElement}
            on:focus={() => {
              drugDropdownVisible = true;
              patientDropdownVisible = false;
            }}
          />
          {#if drugDropdownVisible && drugs.length > 0}
            <div class="dropdown visible mt-2">
              {#each drugs as drug}
                <span hidden>{drug.id}</span>
                <button class="w-full border-2 border-neutral-300 rounded-lg px-2 py-1 mb-1" on:click={() => drugInputValue = drug.name}>{drug.name}</button>
              {/each}
            </div>
          {:else if drugDropdownVisible}
            <div class="dropdown visible mt-2">
              <p class="border-2 border-neutral-300 rounded-lg px-2 py-1">No results found</p>
            </div>
          {/if}
        </div>
  
        <div class="w-full">
          <div class='flex flex-col mb-4'>
            <label for='numPills'>Number of Pills</label>
            <input class="border-2 border-neutral-300 rounded-lg px-2 py-1" id="numPills" autocomplete="off" />
          </div>
          <div class='flex flex-col mb-4'>
            <label for='oftenPills'>Prescription Period</label>
            <input class="border-2 border-neutral-300 rounded-lg px-2 py-1" id="oftenPills" autocomplete="off" />
          </div>
        </div>
  
        <div class='w-full'>
          <button class='w-full bg-black text-white rounded-lg px-4 py-2' type='submit'>Submit</button>
        </div>
      </form>
    </div>
  </main>
  