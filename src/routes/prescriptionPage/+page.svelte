<script>
    import { onMount } from "svelte";
  
    let patientDropdownVisible = false;
    let drugDropdownVisible = false;
    let personInputValue = "";
    let drugInputValue = "";
    let personInputElement;
    let drugInputElement;
    let people = [];
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
      // Function call to the database that returns a list of people names and their ids that will be hidden
    }
  
    const drugSearch = () => {
      drugs.push({'name':'Advil', 'id':'1'}) // Function call to the database that returns a list of drug names and their ids that will be hidden
    }
  </script>
  
  <main>
    <div class="mx-auto text-center flex-col gap-4 w-3/12">
      <h1 class="text-xl">Enter A New Prescription</h1>
  
      <form method="POST">
        <div id="personInput">
            <input
                type="text"
                class="border-2 border-neutral-300 rounded-lg px-2 py-1 m-5"
                placeholder="Search Patient By Name."
                autocomplete="off"
                id="peopleInput"
                bind:value={personInputValue}
                on:input={peopleSearch}
                bind:this={personInputElement}
                on:click={() => {
                patientDropdownVisible = !patientDropdownVisible;
                drugDropdownVisible = false;
                }}
            />
            {#if patientDropdownVisible && people.size > 0}
                <div class="dropdown visible">
                    {#each people as person}
                        <span hidden>{person.id}</span>
                        <button class="border-2 border-neutral-300 rounded-lg px-2 py-1" on:click={() => personInputValue = person.name}>{person.name}</button>
                    {/each}
                </div>
            {:else if patientDropdownVisible}
                <div class="dropdown visible">
                <p class="border-2 border-neutral-300 rounded-lg px-2 py-1">No results found</p>
                </div>
            {/if}
        </div>
  
        <div id="drugTypeInput">
            <input
                type="text"
                class="border-2 border-neutral-300 rounded-lg px-2 py-1 m-5"
                placeholder="Search Drug By Name."
                autocomplete="off"
                id="drugInput"
                bind:value={drugInputValue}
                on:input={drugSearch}
                bind:this={drugInputElement}
                on:click={() => {
                drugDropdownVisible = !drugDropdownVisible;
                patientDropdownVisible = false;
                }}
            />
            {#if drugDropdownVisible && drugs.length > 0}
                <div class="dropdown visible">
                    {#each drugs as drug}
                      <span hidden>{drug.id}</span>
                      <button class="border-2 border-neutral-300 rounded-lg px-2 py-1" on:click={() => drugInputValue = drug.name}>{drug.name}</button>
                    {/each}
                </div>
            {:else if drugDropdownVisible}
                <div class="dropdown visible">
                <p class="border-2 border-neutral-300 rounded-lg px-2 py-1">No results found</p>
                </div>
            {/if}
        </div>
        
        <div class='flex flex-col m-5'>
          <label for='numPills'>Number of Pills</label>
          <input class="border-2 border-neutral-300 rounded-lg px-2 py-1" id="numPills" autocomplete="off" />
        </div>
        <div class='flex flex-col m-5'>
          <label for='oftenPills'>Prescription Period</label>
          <input class="border-2 border-neutral-300 rounded-lg px-2 py-1" id="oftenPills" autocomplete="off" />
        </div>
        
        <div class='flex flex-col m-5'>
          <button class='bg-black text-white rounded-lg' type='submit'>Submit</button>
        </div>
        
      </form>
    </div>
  </main>