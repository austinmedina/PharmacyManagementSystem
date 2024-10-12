<script lang="ts">
    import type {PageData} from "./$types";
    import Search from "$lib/components/Search.svelte";
    export let data: PageData;
    console.log(data);
</script>

<main class="flex justify-center mt-10">
    <div class="w-full max-w-md text-center flex flex-col gap-4">
        <h1 class="text-xl mb-4">Enter A New Prescription</h1>

        <form method="POST" class="flex flex-col items-center gap-4">
            <!-- <Search items={ data.people } placeholder="Search Person By Name"/> -->

            <Search items={data.products} placeholder="Search Drug By Name" />

            <div class="w-full">
                <div class="flex flex-col mb-4">
                    <label for="numPills">Number of Pills</label>
                    <input
                        class="border-2 border-neutral-300 rounded-lg px-2 py-1"
                        id="numPills"
                        autocomplete="off" />
                </div>
                <div class="flex flex-col mb-4">
                    <label for="oftenPills">Prescription Period</label>
                    <input
                        class="border-2 border-neutral-300 rounded-lg px-2 py-1"
                        id="oftenPills"
                        autocomplete="off" />
                </div>
            </div>

            <div class="w-full">
                <button
                    class="w-full bg-black text-white rounded-lg px-4 py-2"
                    type="submit">Submit</button>
            </div>
        </form>
    </div>
</main>
