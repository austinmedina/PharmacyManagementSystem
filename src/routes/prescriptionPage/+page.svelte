<script>
    import { onMount } from "svelte";
  
    let patientDropdownVisible = false;
    let drugDropdownVisible = false;
    let personInputValue = "";
    let drugInputValue = "";
    let personInputElement;
    let drugInputElement;
    let people = new Map();
    let drugs = new Map();
  
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
      // Function call to the database that returns a list of drug names and their ids that will be hidden
    }
  </script>
  
  <main>
    <div class="text-center flex flex-col gap-4 mx-8">
      <h1>Enter A New Prescription</h1>
  
      <form method="POST">
        <div id="personInput">
            <input
                type="text"
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
                        <button on:click={() => personInputValue = person.name}>{person.name}</button>
                    {/each}
                </div>
            {:else if patientDropdownVisible}
                <div class="dropdown visible">
                <p>No results found</p>
                </div>
            {/if}
        </div>
  
        <div id="drugTypeInput">
            <input
                type="text"
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
            {#if drugDropdownVisible && drugs.size > 0}
                <div class="dropdown visible">
                    {#each drugs as drug}
                    <span hidden>{drug.id}</span>
                        <button on:click={() => drugInputValue = drug.name}>{drug.name}</button>
                    {/each}
                </div>
            {:else if drugDropdownVisible}
                <div class="dropdown visible">
                <p>No results found</p>
                </div>
            {/if}
        </div>
  
        <label>
          Number of Pills
          <input name="numPills" autocomplete="off" />
        </label>
        <label>
          Prescription Frequency
          <input name="oftenPills" autocomplete="off" />
        </label>

        <button type='submit'>Submit</button>
      </form>
    </div>
  </main>