<script lang="ts">
    import Icon from "@iconify/svelte";
    import Item from "$lib/components/item.svelte";
    import type {CartEntry} from "$lib/types.js";
    export let data;
    let inventory: CartEntry[] = data.inventory;
    let cart: Set<CartEntry> = new Set();
    let showCart = false;
    let search = "";

    function toggleCart() {
        showCart = !showCart;
    }

    function clearCart() {
        cart.clear();
        cart = new Set(cart);
        toggleCart();
    }

    function removeFromCart(item: CartEntry) {
        cart.delete(item);
        cart = new Set(cart);
    }

    function getTotalCost() {
        let cartArr = Array.from(cart);
        let sum = 0;
        for (let i = 0; i < cartArr.length; ++i) {
            sum += (cartArr[i].price / 100) * cartArr[i].quantity;
        }
        return sum.toFixed(2);
    }
</script>

<main class="mx-20 lg:mx-40">
    <h1 class="text-center text-4xl my-8">Checkout</h1>
    <form method="GET" class="flex justify-evenly items-end mb-4">
        <div>
            <h2 class="text-lg">Search</h2>
            <div class="flex">
                <input
                    class="border-neutral-300 border-2"
                    bind:value={search} />
                <button type="submit">
                    <Icon icon="material-symbols:search" class="text-2xl" />
                </button>
            </div>
        </div>
        <div>
            <div>
                <input type="checkbox" id="prescription" />
                <label for="prescription">Prescription</label>
            </div>
            <div>
                <input type="checkbox" id="non_prescription" />
                <label for="non_prescription">Non-prescription</label>
            </div>
        </div>
    </form>
    <div
        class="flex flex-col gap-4 p-4 mb-4 max-h-80 border-2 border-neutral-500 overflow-auto">
        {#each inventory as product}
            {#if product.name.toLowerCase().match(search.toLowerCase())}
                <Item medication={product} bind:cart />
            {/if}
        {/each}
    </div>
    <div class="flex justify-center items-center">
        <button
            on:click={toggleCart}
            class="bg-orange-500 hover:bg-orange-400 py-2 px-6 text-white text-xl rounded-xl"
            >Checkout Cart</button>
    </div>

    {#if showCart}
        <div
            class="absolute top-0 left-0 w-full h-screen flex justify-center items-center">
            <div class="bg-blue-200 w-1/2 h-2/3 rounded-3xl p-4">
                <div class="flex justify-end">
                    <button on:click={toggleCart}>
                        <Icon
                            icon="carbon:close-filled"
                            class="text-3xl hover:text-red-500" />
                    </button>
                </div>
                <h1 class="text-center text-4xl mb-8">CART</h1>
                <div
                    class="flex flex-col gap-4 p-4 mb-8 mx-12 max-h-80 border-2 border-neutral-500 overflow-auto">
                    {#key cart}
                        {#each cart as item}
                            <div
                                class="flex justify-between items-center bg-neutral-100 p-4 rounded-xl">
                                <h1>{item.name}</h1>
                                <div>
                                    <input
                                        type="number"
                                        id="quanity"
                                        bind:value={item.quantity}
                                        min="0"
                                        class="w-10 text-center rounded-lg border-gray-400 border-2" />
                                    <label for="quantity"> in cart</label>
                                </div>
                                <span
                                    >${(
                                        (item.price / 100) *
                                        item.quantity
                                    ).toFixed(2)}</span>
                                <button
                                    class="bg-red-400 px-4 py-1 rounded-lg hover:bg-red-500 text-white"
                                    on:click={() => removeFromCart(item)}
                                    >Remove</button>
                            </div>
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
                                class="py-2 px-6 text-xl bg-green-500 hover:bg-green-400 rounded-xl"
                                >Purchase</button>
                        </form>
                    {/key}
                    <button
                        class="py-2 px-6 text-xl bg-blue-500 hover:bg-blue-400 rounded-xl"
                        on:click={clearCart}>Clear Cart</button>
                </div>
            </div>
        </div>
    {/if}
</main>
