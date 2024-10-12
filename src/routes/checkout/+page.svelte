<script>
    import Icon from "@iconify/svelte";
    import Item from "$lib/components/item.svelte";
    import CartItem from "$lib/components/cartItem.svelte";
    let showCart = false;

    function toggleCart() {
        showCart = !showCart;
    }
</script>

<main class="mx-20 lg:mx-40">
    <h1 class="text-center text-4xl my-8">Checkout</h1>
    <form method="GET" class="flex justify-evenly items-end mb-4">
        <div>
            <h2 class="text-lg">Search</h2>
            <div class="flex">
                <input class="border-neutral-300 border-2" />
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
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
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
                    <CartItem />
                    <CartItem />
                    <CartItem />
                    <CartItem />
                    <CartItem />
                </div>
                <div class="flex justify-center gap-8">
                    <button
                        class="py-2 px-6 text-xl bg-green-500 hover:bg-green-400 rounded-xl"
                        >Purchase</button>
                    <button
                        class="py-2 px-6 text-xl bg-blue-500 hover:bg-blue-400 rounded-xl"
                        >Clear Cart</button>
                </div>
            </div>
        </div>
    {/if}
</main>
