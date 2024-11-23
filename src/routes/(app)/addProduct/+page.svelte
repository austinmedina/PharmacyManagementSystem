<script lang="ts">
    import {ProductType} from "$lib/types";
    let price: number = 0;

    function checkPrice() {
        if (price < 0) {
            price = 0;
        }
    }
</script>

<main>
    <h1 class="text-center mt-12 text-white text-3xl">Add New Product</h1>
    <div class="flex justify-center mt-8">
        <form
            method="POST"
            class="flex flex-col items-center gap-6 p-8 bg-white w-2/5 rounded-3xl shadow-2xl">
            <div>
                <label for="name" class="mr-4">Product Name:</label>
                <input
                    id="name"
                    name="name"
                    class="border-2 border-neutral-300 rounded-lg py-1 px-2"
                    required />
            </div>
            <div class="flex items-center">
                <label for="price" class="mr-4">Price (per unit):</label>
                <div
                    class="group border-2 border-neutral-300 rounded-lg focus-within:border-black">
                    <span class="pl-2">$</span>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        required
                        bind:value={price}
                        on:change={checkPrice}
                        class="py-1 px-2 mr-1 w-44 focus:outline-none" />
                </div>
            </div>
            <div class="flex justify-center gap-8">
                <div>
                    <input
                        type="radio"
                        id="prescription"
                        name="type"
                        value={ProductType.Prescription}
                        checked />
                    <label for="prescription">Prescription</label>
                </div>
                <div>
                    <input
                        type="radio"
                        id="non_prescription"
                        name="type"
                        value={ProductType.NonPrescription} />
                    <label for="non_prescription">Non Prescription</label>
                </div>
            </div>
            <button
                type="submit"
                class="my-4 text-white text-lg rounded-xl px-6 py-2 bg-green-600 hover:bg-green-700"
                >Add Product</button>
        </form>
    </div>
</main>
