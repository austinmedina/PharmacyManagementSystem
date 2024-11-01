<script lang="ts">
    import Icon from "@iconify/svelte";
    import Item from "$lib/components/item.svelte";
    import {type CartEntry, type Prescription} from "$lib/types.js";
    export let data;
    let inventory: CartEntry[] = data.inventory;
    let prescriptions: Prescription[] = data.prescriptions;
    let cart = new Set<CartEntry | Prescription>();
    let showCart = false;
    let search = "";
    let show_prescription = false;
    let show_non_prescription = false;

    function toggleCart() {
        showCart = !showCart;
    }

    function clearCart() {
        cart.clear();
        cart = new Set(cart);
        toggleCart();
    }

    function removeFromCart(item: CartEntry | Prescription) {
        cart.delete(item);
        cart = new Set(cart);
    }

    function getTotalCost() {
        let cartArr = Array.from(cart);
        let sum = 0;
        for (let i = 0; i < cartArr.length; ++i) {
            if ("price" in cartArr[i]) {
                sum +=
                    ((cartArr[i] as CartEntry).price / 100) *
                    cartArr[i].quantity;
            } else {
                sum +=
                    ((cartArr[i] as Prescription).product.price / 100) *
                    cartArr[i].quantity;
            }
        }
        return sum.toFixed(2);
    }

    function checkQuantity(item: CartEntry) {
        if (item.quantity < 0) {
            item.quantity = 0;
        } else if (item.quantity > item.totalQuantity) {
            item.quantity = item.totalQuantity;
        }
    }
</script>

<main class="mx-20 lg:mx-40">
    <h1 class="text-center text-4xl text-white my-8">Checkout</h1>
    <div class="flex justify-evenly items-end mb-4">
        <div>
            <h2 class="text-lg text-white">Search</h2>
            <div class="flex">
                <input
                    class="border-neutral-300 border-2"
                    bind:value={search} />
                <button type="submit">
                    <Icon
                        icon="material-symbols:search"
                        class="text-2xl text-white hover:text-cyan-400" />
                </button>
            </div>
        </div>
        <div>
            <div>
                <input
                    type="checkbox"
                    id="prescription"
                    bind:checked={show_prescription} />
                <label for="prescription" class="text-white"
                    >Prescription</label>
            </div>
            <div>
                <input
                    type="checkbox"
                    id="non_prescription"
                    bind:checked={show_non_prescription} />
                <label for="non_prescription" class="text-white"
                    >Non-prescription</label>
            </div>
        </div>
    </div>
    <div class="flex justify-between text-lg px-4 text-white ml-4 mr-7 mb-2">
        <span class="w-20 text-center">ID</span>
        <h1 class="text-lg text-center w-60">Medication</h1>
        <h2 class="w-24 text-center">In Stock</h2>
        <span class="inline-block text-center w-32">Price</span>
        <span class="inline-block items-center justify-between w-32"></span>
    </div>
    <div class="flex flex-col gap-4 px-4 mb-4 max-h-96 overflow-auto shadow-lg">
        {#key show_prescription || show_non_prescription}
            {#each prescriptions as product}
                {#if product.product.name
                    .toLowerCase()
                    .match(search.toLowerCase()) && (show_prescription || (!show_prescription && !show_non_prescription))}
                    <Item medication={product} bind:cart />
                {/if}
            {/each}
            {#each inventory as product}
                {#if product.name
                    .toLowerCase()
                    .match(search.toLowerCase()) && (show_non_prescription || (!show_prescription && !show_non_prescription))}
                    <Item medication={product} bind:cart />
                {/if}
            {/each}
        {/key}
    </div>
    <div class="flex justify-center items-center">
        <button
            on:click={toggleCart}
            class="bg-blue-500 border-2 border-white hover:bg-cyan-400 py-2 px-6 text-white text-xl rounded-xl"
            >Checkout Cart</button>
    </div>

    {#if showCart}
        <div
            class="absolute top-0 left-0 w-full h-screen flex justify-center items-center">
            <div
                class="bg-cyan-50 w-1/2 h-2/3 rounded-3xl p-4 shadow-blue-400 shadow-2xl border-2 border-blue-300">
                <div class="flex justify-end">
                    <button on:click={toggleCart}>
                        <Icon
                            icon="carbon:close-filled"
                            class="text-3xl hover:text-red-500" />
                    </button>
                </div>
                <h1 class="text-center text-4xl mb-8">CART</h1>
                <div
                    class="flex flex-col gap-4 p-4 mb-8 mx-12 max-h-80 shadow-lg overflow-auto">
                    {#key cart}
                        {#each cart as item}
                            {#if "type" in item}
                                <div
                                    class="flex justify-between items-center bg-blue-400 text-white p-4 rounded-xl">
                                    <h1 class="w-28">{item.name}</h1>
                                    <div class="w-28">
                                        <input
                                            type="number"
                                            id="quanity"
                                            bind:value={item.quantity}
                                            on:change={() =>
                                                checkQuantity(item)}
                                            min="0"
                                            max={item.totalQuantity}
                                            class="w-14 text-center rounded-lg border-gray-200 bg-blue-400 border-2" />
                                        <label for="quantity"> in cart</label>
                                    </div>
                                    <span class="inline-block w-20"
                                        >${(
                                            (item.price / 100) *
                                            item.quantity
                                        ).toFixed(2)}</span>
                                    <button
                                        class="bg-red-400 px-4 py-1 rounded-lg hover:bg-red-500 text-white"
                                        on:click={() => removeFromCart(item)}
                                        >Remove</button>
                                </div>
                            {:else}
                                <div
                                    class="flex justify-between items-center bg-blue-400 text-white p-4 rounded-xl">
                                    <h1 class="w-28">{item.product.name}</h1>
                                    <span class="inline-block w-28"
                                        >{item.quantity} in cart</span>
                                    <span class="inline-block w-20"
                                        >${(
                                            (item.product.price / 100) *
                                            item.quantity
                                        ).toFixed(2)}</span>
                                    <button
                                        class="bg-red-400 px-4 py-1 rounded-lg hover:bg-red-500 text-white"
                                        on:click={() => removeFromCart(item)}
                                        >Remove</button>
                                </div>
                            {/if}
                        {/each}
                    {/key}
                </div>
                <div>
                    {#key cart}
                        <h2 class="text-center text-xl mb-8">
                            Total Cost: ${getTotalCost()}
                        </h2>
                    {/key}
                </div>
                <div class="flex justify-center gap-8">
                    {#key cart}
                        <form method="POST">
                            <input
                                name="cart"
                                value={JSON.stringify(Array.from(cart))}
                                class="hidden" />
                            <button
                                type="submit"
                                class="py-2 px-6 text-xl bg-green-500 hover:bg-green-400 rounded-xl text-white"
                                >Purchase</button>
                        </form>
                    {/key}
                    <button
                        class="py-2 px-6 text-xl bg-blue-500 hover:bg-blue-400 rounded-xl text-white"
                        on:click={clearCart}>Clear Cart</button>
                </div>
            </div>
        </div>
    {/if}
</main>
