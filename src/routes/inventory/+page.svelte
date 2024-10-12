<script>
    import Icon from "@iconify/svelte";
    import Medication from "$lib/components/medication.svelte";
</script>

<main>
    <!-- Only one of these icons will be shown at a time -->
    <div class="flex justify-end">
        <Icon
            icon="material-symbols-light:notifications-rounded"
            class="text-5xl" />
        <Icon
            icon="material-symbols-light:notifications-active-rounded"
            class="text-5xl" />
    </div>

    <h1 class="text-center text-3xl mb-4">Inventory</h1>
    <div class="flex flex-col gap-4 mx-8">
        <div class="flex justify-around text-lg">
            <h2><strong>ID</strong></h2>
            <h2><strong>Medication</strong></h2>
            <h2><strong>In stock</strong></h2>
            <span class="w-12"></span>
            <span class="w-12"></span>
        </div>
        <!-- These will eventually be looped through -->
        <Medication />
        <Medication />
        <Medication />
    </div>
</main>
