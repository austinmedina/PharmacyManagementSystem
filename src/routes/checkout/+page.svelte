<script>
    import Icon from "@iconify/svelte";
    import Item from "$lib/components/item.svelte";
    let cart = false;
</script>

<main class="mx-20 lg:mx-40">
    <h1 class="text-center text-4xl my-8">Checkout</h1>
    <form method="GET" class="flex justify-evenly items-end mb-4">
        <div>
            <h2 class="text-lg">Search</h2>
            <div class="flex">
                <input class="border-neutral-300 border-2">
                <button type="submit">
                    <Icon icon="material-symbols:search" class="text-2xl"/>
                </button>
            </div>
        </div>
        <div>
            <div>
                <input type="checkbox" id="prescription" >
                <label for="prescription">Prescription</label>
            </div>
            <div>
                <input type="checkbox" id="non_prescription" >
                <label for="non_prescription">Non-prescription</label>
            </div>
        </div>
    </form>
    <div class="flex flex-col gap-4">
        <Item />
        <Item />
        <Item />
    </div>
</main>