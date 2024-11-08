<!-- Cashier -->

<script>
    let showMenu = false;
    import Icon from "@iconify/svelte";
</script>

<nav class="flex justify-between p-8 mt-6 bg-white shadow-2xl">
    <Icon icon="mdi:pill" class="text-green-600 w-10 h-10" />
    <div class="flex justify-evenly gap-8">
        <a
            href="/checkout"
            class="px-6 py-1 rounded-2xl hover:bg-blue-400 hover:text-white"
            >Checkout</a>
        <a
            href="/prescriptions"
            class="px-6 py-1 rounded-2xl hover:bg-blue-400 hover:text-white"
            >Prescriptions</a>
        <a
            href="/logs"
            class="px-6 py-1 rounded-2xl hover:bg-blue-400 hover:text-white"
            >Logs</a>
    </div>
    <div class="relative">
        <button
            class="focus:outline-none"
            on:click={() => (showMenu = !showMenu)}>
            <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 11c2.76 0 5-2.24 5-5S14.76 1 12 1 7 3.24 7 6s2.24 5 5 5zM2 20a10 10 0 0 1 20 0H2z"
                ></path>
            </svg>
        </button>
        {#if showMenu}
            <div
                class="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl">
                <a
                    href="/profile"
                    class="block px-4 py-2 text-gray-800 hover:bg-blue-400 hover:text-white"
                    >Profile</a>
                <form
                    method="post"
                    action="/logout?/logout"
                    class="block px-4 py-2">
                    <button
                        class="w-full text-left text-gray-800 hover:bg-blue-400 hover:text-white"
                        >Logout</button>
                </form>
            </div>
        {/if}
    </div>
</nav>
