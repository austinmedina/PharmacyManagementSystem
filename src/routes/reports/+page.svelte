<script>
    // JUST A CHECK FOR NOW - replace when have backend

    let startDate = '';
    let endDate = '';
  
    function generateFinancialReport() {
      console.log('Financial Report Start Date:', startDate);
      console.log('Financial Report End Date:', endDate);
    }
  
    function generateInventoryReport() {
      console.log('Inventory Report Start Date:', startDate);
      console.log('Inventory Report End Date:', endDate);
    }
  </script>
  
  <div class="flex justify-center bg-neutral-200 p-4 rounded-3xl mx-auto w-1/4 space-x-6">
    <div class="flex flex-col space-y-4">
      <div class="flex space-x-4">
        <label for="start-date" class="self-center">Start Date:</label>
        <input type="date" id="start-date" bind:value={startDate} class="border rounded-lg px-2 py-1" />
      </div>
      <div class="flex space-x-4">
        <label for="end-date" class="self-center">End Date:</label>
        <input type="date" id="end-date" bind:value={endDate} class="border rounded-lg px-2 py-1" />
      </div>
    </div>
  </div>
  
  <div class="flex justify-center bg-neutral-200 p-4 rounded-3xl mx-auto w-1/4 space-x-6">
    <button class="bg-blue-700 hover:bg-purple-700 text-white py-1 px-4 rounded-xl" on:click={generateFinancialReport}>
      Generate Financial Report
    </button>
    <button class="bg-blue-700 hover:bg-purple-700 text-white py-1 px-4 rounded-xl" on:click={generateInventoryReport}>
        Generate Inventory Report
      </button>
  </div>
  <div class="flex justify-center bg-neutral-200 p-4 rounded-3xl mx-auto w-10/12 space-x-6">
    <h1 class="text-center text-2xl my-8">Financial Report Preview:</h1>
  </div>
  <div class="flex justify-center bg-neutral-200 p-4 rounded-3xl mx-auto w-10/12 space-x-6">
    <h1 class="text-center text-2xl my-8">Inventory Report Preview:</h1>
  </div>