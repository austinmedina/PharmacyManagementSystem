<script>
    import Icon from "@iconify/svelte";
    import Account from "$lib/components/accounts.svelte";
</script>

<main>
    <h1 class="text-center text-3xl my-8">Manage Accounts</h1>
    <a
        href="/createUser"
        class="block mb-4 bg-blue-700 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl text-center w-1/6 mx-auto">
        Create Account
    </a>
    <form method="GET" class="flex justify-center items-center gap-4 mb-4">
        <h2 class="text-2xl">Search</h2>
        <div class="flex">
            <input placeholder="Username" class="border-neutral-300 border-2" />
            <button type="submit">
                <Icon
                    icon="material-symbols:search"
                    class="text-2xl hover:text-blue-700" />
            </button>
        </div>
    </form>
    <div class="flex flex-col gap-4 mx-20 my-8 lg:mx-60">
        <Account />
        <Account />
        <Account />
        <Account />
        <Account />
        <Account />
        <Account />
        <Account />
    </div>
</main>
