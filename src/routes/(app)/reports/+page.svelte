<script lang="ts">
    import {fade} from "svelte/transition";
    import {utils, writeFileXLSX} from "xlsx";

    export let data;

    let inventoryReports = data.inventoryReport;
    let financialReports = data.financialReport;
    let filteredFinancialReports = financialReports;
    let filteredInventoryReports = inventoryReports;
    let products = data.product;

    let startDate = "";
    let endDate = "";
    // Gets name of a product with product ID
    function getProduct(productID: number) {
        const product = products.find((p) => p.id === productID);
        return product ? product.name : "Unknown Product";
    }
    //Changes action from 0/1 to added/removed
    function mapAction(action: number) {
        return action === 0
            ? "Added"
            : action === 1
              ? "Removed"
              : "Unknown Action";
    }
    //Filters data based on if the user decides to specify a date range, this changes the report and the previews
    function updateReports() {
        filteredFinancialReports = financialReports.filter((report) => {
            const reportDate = new Date(report.time);
            return (
                (!startDate || reportDate >= new Date(startDate)) &&
                (!endDate || reportDate <= new Date(endDate))
            );
        });

        filteredInventoryReports = inventoryReports.filter((report) => {
            const reportDate = new Date(report.time);
            return (
                (!startDate || reportDate >= new Date(startDate)) &&
                (!endDate || reportDate <= new Date(endDate))
            );
        });
    }
    //Creates the excel Reports for each one
    function downloadFinancialReport() {
        const data = filteredFinancialReports.map((report) => ({
            Time: new Date(report.time).toLocaleDateString(),
            "Product ID": report.itemID,
            Product: getProduct(report.itemID),
            "Total Price": report.totalPrice.toFixed(2),
            Quantity: report.quantity,
            "Cart ID": report.cartID
        }));

        const ws = utils.json_to_sheet(data);

        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Financial Report");

        writeFileXLSX(wb, "Financial_Report.xlsx");
    }
    function downloadInventoryReport() {
        const data = filteredInventoryReports.map((report) => ({
            Time: new Date(report.time).toLocaleDateString(),
            "Product ID": report.productID,
            Product: getProduct(report.productID),
            Action: mapAction(report.action),
            Quantity: report.quantity
        }));

        const ws = utils.json_to_sheet(data);

        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Inventory Report");

        writeFileXLSX(wb, "Inventory_Report.xlsx");
    }
</script>

<div class="max-w-7xl mx-auto p-4" in:fade={{delay: 400}} out:fade>
    <div class="bg-white shadow-lg rounded-lg p-6 mb-6">
        <!-- Filter by Dates -->
        <h1 class="text-2xl font-bold text-gray-800 mb-4 text-center">
            Filter Reports by Date
        </h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label
                    for="start-date"
                    class="block text-gray-700 text-center font-medium mb-2"
                    >Start Date</label>
                <input
                    type="date"
                    id="start-date"
                    bind:value={startDate}
                    class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <label
                    for="end-date"
                    class="block text-gray-700 text-center font-medium mb-2"
                    >End Date</label>
                <input
                    type="date"
                    id="end-date"
                    bind:value={endDate}
                    class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
        </div>
        <div class="flex justify-center mt-4">
            <button
                class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                on:click={updateReports}>
                Update Dates
            </button>
        </div>
    </div>
    <!--Financial Report Preview and download button-->
    <div class="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-4 text-center">
            Financial Report Preview
        </h1>
        <div class="overflow-x-auto max-h-96">
            <table
                class="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr class="bg-blue-600 text-white">
                        <th class="border border-gray-500 px-4 py-2">Time</th>
                        <th class="border border-gray-500 px-4 py-2"
                            >Product ID</th>
                        <th class="border border-gray-500 px-4 py-2"
                            >Product</th>
                        <th class="border border-gray-500 px-4 py-2"
                            >Total Price</th>
                        <th class="border border-gray-500 px-4 py-2"
                            >Quantity</th>
                        <th class="border border-gray-500 px-4 py-2"
                            >Cart ID</th>
                    </tr>
                </thead>
                <tbody>
                    {#each filteredFinancialReports as report}
                        <tr class="even:bg-gray-100 hover:bg-blue-200">
                            <td
                                class="border border-gray-500 px-4 py-2 text-center"
                                >{new Date(
                                    report.time
                                ).toLocaleDateString()}</td>
                            <td
                                class="border border-gray-500 px-4 py-2 text-center"
                                >{report.itemID}</td>
                            <td
                                class="border border-gray-500 px-4 py-2 text-center"
                                >{getProduct(report.itemID)}</td>
                            <td
                                class="border border-gray-500 px-4 py-2 text-center"
                                >${report.totalPrice.toFixed(2)}</td>
                            <td
                                class="border border-gray-500 px-4 py-2 text-center"
                                >{report.quantity}</td>
                            <td
                                class="border border-gray-500 px-4 py-2 text-center"
                                >{report.cartID}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <div class="flex justify-center mt-4">
            <button
                class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                on:click={downloadFinancialReport}>
                Download Financial Report
            </button>
        </div>
    </div>
    <!-- Inventory Report Preview and download button-->
    <div class="bg-white shadow-lg rounded-lg p-6">
        <h1 class="text-2xl font-bold text-gray-800 text-center mb-4">
            Inventory Report Preview
        </h1>
        <div class="overflow-x-auto max-h-96">
            <table
                class="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr class="bg-blue-600 text-white">
                        <th class="border border-gray-500 px-4 py-2">Time</th>
                        <th class="border border-gray-500 px-4 py-2"
                            >Product ID</th>
                        <th class="border border-gray-500 px-4 py-2"
                            >Product</th>
                        <th class="border border-gray-500 px-4 py-2">Action</th>
                        <th class="border border-gray-500 px-4 py-2"
                            >Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {#each filteredInventoryReports as report}
                        <tr class="even:bg-gray-100 hover:bg-blue-200">
                            <td
                                class="border border-gray-500 px-4 py-2 text-center"
                                >{new Date(
                                    report.time
                                ).toLocaleDateString()}</td>
                            <td
                                class="border border-gray-500 px-4 py-2 text-center"
                                >{report.productID}</td>
                            <td
                                class="border border-gray-500 px-4 py-2 text-center"
                                >{getProduct(report.productID)}</td>
                            <td
                                class="border border-gray-500 px-4 py-2 text-center"
                                >{mapAction(report.action)}</td>
                            <td
                                class="border border-gray-500 px-4 py-2 text-center"
                                >{report.quantity}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <div class="flex justify-center mt-4">
            <button
                class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                on:click={downloadInventoryReport}>
                Download Inventory Report
            </button>
        </div>
    </div>
</div>
