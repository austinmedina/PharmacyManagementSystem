<script>
    import Icon from "@iconify/svelte";
    export let medication;
    let showAdd = false;
    let showRemove = false;

    function toggleAdd() {
        showAdd = !showAdd;
    }

    function toggleRemove() {
        showRemove = !showRemove;
    }
</script>

<div
    class="flex justify-between items-center
bg-cyan-50 rounded-xl py-4 px-4">
    <span class="w-20 text-center">{medication.id}</span>
    <h1 class="text-lg text-center w-60">{medication.name}</h1>
    <h2 class="w-24 text-center">{medication.totalQuantity} in stock</h2>
    <div class="flex flex-col w-40">
        <span>{medication.numExpired} expired</span>
        <span>{medication.numExpiringSoon} expiring soon</span>
    </div>
    <div class="flex items-center justify-between w-48 text-white">
        <button
            class="bg-blue-400 px-6 py-1 rounded-xl
        hover:bg-cyan-400"
            on:click={toggleAdd}>Add</button>
        <button
            class="bg-red-400 px-4 py-1 rounded-xl
        hover:bg-red-500"
            on:click={toggleRemove}>Remove</button>
    </div>
</div>
{#if showAdd}
    <form
        method="POST"
        action="/inventory?/add"
        class="absolute top-0 left-0 w-full h-screen flex justify-center items-center">
        <div
            class="flex flex-col gap-4 bg-blue-200 w-1/2 h-2/3 rounded-3xl p-4">
            <div class="flex justify-end">
                <button on:click={toggleAdd}>
                    <Icon
                        icon="carbon:close-filled"
                        class="text-3xl hover:text-red-500" />
                </button>
            </div>
            <h1 class="text-center text-4xl mb-8">
                Add {medication.name} to Inventory
            </h1>
            <div class="flex flex-col justify-center items-center">
                <h2>{medication.totalQuantity} in stock</h2>
                <span>{medication.numExpired} expired</span>
                <span>{medication.numExpiringSoon} expiring soon</span>
            </div>
            <input name="productID" value={medication.id} class="hidden" />
            <div>
                <label for="quantity"># To add</label>
                <input id="quantity" name="quantity" type="number" />
            </div>
            <div>
                <label for="expirationDate">Expiration Date</label>
                <input id="expirationDate" name="expirationDate" type="date" />
            </div>
            <button type="submit" class="bg-blue-400 hover:bg-purple-400"
                >Add</button>
            <button on:click={toggleAdd} class="bg-red-500 hover:bg-red-300"
                >Cancel</button>
        </div>
    </form>
{/if}
{#if showRemove}
    <form
        method="POST"
        action="/inventory?/remove"
        class="absolute top-0 left-0 w-full h-screen flex justify-center items-center">
        <div
            class="flex flex-col gap-4 bg-blue-200 w-1/2 h-2/3 rounded-3xl p-4">
            <div class="flex justify-end">
                <button on:click={toggleRemove}>
                    <Icon
                        icon="carbon:close-filled"
                        class="text-3xl hover:text-red-500" />
                </button>
            </div>
            <h1 class="text-center text-4xl mb-8">
                Add {medication.name} to Inventory
            </h1>
            <div class="flex flex-col justify-center items-center">
                <h2>{medication.totalQuantity} in stock</h2>
                <span>{medication.numExpired} expired</span>
                <span>{medication.numExpiringSoon} expiring soon</span>
            </div>
            <input name="productID" value={medication.id} class="hidden" />
            <div>
                <label for="quantity"># To Remove</label>
                <input id="quantity" name="quantity" type="number" />
            </div>

            <button type="submit" class="bg-blue-400 hover:bg-purple-400"
                >Remove</button>
            <button on:click={toggleRemove} class="bg-red-500 hover:bg-red-300"
                >Cancel</button>
        </div>
    </form>
{/if}
