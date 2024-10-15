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
    class="flex justify-around items-center
bg-neutral-100 rounded-xl py-2">
    <span>{medication.id}</span>
    <div class="flex flex-col">
        <h1>{medication.name}</h1>
        <span>{medication.numExpired} expired</span>
        <span>{medication.numExpiringSoon} expiring soon</span>
    </div>
    <h2>{medication.totalQuantity}</h2>
    <button
        class="bg-green-400 px-4 py-1 rounded-xl
    hover:bg-green-500 hover:text-white"
        on:click={toggleAdd}>Add</button>
    <button
        class="bg-red-400 px-4 py-1 rounded-xl
    hover:bg-red-500 hover:text-white"
        on:click={toggleRemove}>Remove</button>
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
