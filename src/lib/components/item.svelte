<script lang="ts">
    import type {CartEntry, Prescription} from "$lib/types";
    import Icon from "@iconify/svelte";
    export let medication: CartEntry | Prescription;
    export let cart: Set<CartEntry | Prescription>;
    let showRemove = false;

    function addToCart() {
        if ("type" in medication) {
            medication.quantity = Math.min(
                1,
                medication.totalQuantity - medication.numExpired
            );
        }
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

<div class="flex justify-between items-center bg-cyan-50 p-4 rounded-xl">
    {#if "type" in medication}
        <span class="w-20 text-center">{medication.id}</span>
        <h1 class="w-60 text-center text-lg">{medication.name}</h1>
        <span class="w-24 text-center inline-block"
            >{medication.totalQuantity - medication.numExpired} available</span>
        <span class="w-32 text-center inline-block"
            >${(medication.price / 100).toFixed(2)} each</span>
    {:else}
        <span class="w-20 text-center">{medication.id}</span>
        <div class="w-60 text-center">
            <h1 class="text-lg">{medication.product.name}</h1>
            <span class="text-gray-700"
                >{medication.patient.firstName}
                {medication.patient.lastName}</span>
        </div>
        <span class="w-24 text-center inline-block"
            >{medication.quantity} prescribed</span>
        <span class="w-32 text-center inline-block"
            >${(medication.product.price / 100).toFixed(2)} each</span>
    {/if}
    {#if !cart.has(medication)}
        <button
            class="bg-blue-400 px-4 py-1 rounded-lg hover:bg-cyan-400 text-white w-32"
            on:click={addToCart}>Add to Cart</button>
    {:else if showRemove}
        <button
            class="bg-red-500 flex justify-center items-center rounded-lg px-2 w-32"
            on:click={removeFromCart}
            on:mouseleave={toggleRemove}>
            <Icon icon="carbon:close-filled" class="text-xl" />
            <span class="px-4 py-1 rounded-lg text-white">Remove</span>
        </button>
    {:else}
        <button
            class="bg-green-400 flex justify-center items-center rounded-lg px-2 w-32"
            on:mouseenter={toggleRemove}>
            <Icon
                icon="fluent:checkmark-12-regular"
                class="text-2xl text-white" />
            <span class="px-4 py-1 rounded-lg text-white">Added</span>
        </button>
    {/if}
</div>
