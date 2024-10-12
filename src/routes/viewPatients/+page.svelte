<script>
    import Icon from "@iconify/svelte";
    import Patient from "$lib/components/patient.svelte";
    // Get patient data here
</script>

<main>
    <h1 class="text-center text-3xl my-8">View Patients</h1>
    <form method="GET" class="flex justify-center items-center gap-4 mb-4">
        <h2 class="text-2xl">Search</h2>
        <div class="flex">
            <input
                placeholder="Patient Name"
                class="border-neutral-300 border-2" />
            <button type="submit">
                <Icon
                    icon="material-symbols:search"
                    class="text-2xl hover:text-purple-500" />
            </button>
        </div>
    </form>
    <div class="flex flex-col gap-4 mx-20 my-8 lg:mx-60">
        <Patient />
        <Patient />
        <Patient />
        <Patient />
        <Patient />
        <Patient />
        <Patient />
        <Patient />
    </div>
</main>
