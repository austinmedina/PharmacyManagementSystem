<script lang="ts">
    import type {CartEntry} from "$lib/types";
    import Icon from "@iconify/svelte";
    export let medication: CartEntry;
    export let cart: Set<CartEntry>;
    let showRemove = false;

    function addToCart() {
        medication.quantity = 1;
        cart.add(medication);
        cart = new Set(cart);
    }

    function removeFromCart() {
        cart.delete(medication);
        cart = new Set(cart);
        showRemove = false;
    }

    function toggleRemove() {
        showRemove = !showRemove;
    }
</script>

<div class="flex justify-around items-center bg-neutral-200 p-4 rounded-xl">
    <span>{medication.id}</span>
    <h1>{medication.name}</h1>
    <span>{medication.totalQuantity} in stock</span>
    <span>${(medication.price / 100).toFixed(2)} each</span>
    {#if !cart.has(medication)}
        <button
            class="bg-orange-500 px-4 py-1 rounded-lg hover:bg-orange-400 text-white"
            on:click={addToCart}>Add to Cart</button>
    {:else if showRemove}
        <button
            class="bg-red-500 flex justify-center items-center rounded-lg px-2"
            on:click={removeFromCart}
            on:mouseleave={toggleRemove}>
            <Icon icon="carbon:close-filled" class="text-xl" />
            <span class="px-4 py-1 rounded-lg text-white">Remove</span>
        </button>
    {:else}
        <button
            class="bg-green-400 flex justify-center items-center rounded-lg px-2"
            on:mouseenter={toggleRemove}>
            <Icon
                icon="fluent:checkmark-12-regular"
                class="text-2xl text-white" />
            <span class="px-4 py-1 rounded-lg text-white">Added</span>
        </button>
    {/if}
</div>
