<script lang="ts">
    import Account from "$lib/components/accounts.svelte";
    export let data;
    let users = data.user;

    const deleteUser = async (userId: string) => {
        const response = await fetch("/api/user", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({userId})
        });

        if (response.ok) {
            users = users.filter((user) => user.id !== userId);
            // console.log("User deleted successfully");
        } else {
            const errorMessage = await response.text();
            console.error("Error deleting user:", errorMessage);
        }
    };

    const recoverUser = async (userId: string) => {
        const _response = await fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({userId})
        });
    };
</script>

<main
    class="flex flex-col mx-auto w-3/4 border-2 border-black rounded-lg shadow-lg p-4 bg-gray-50">
    <h1 class="text-center text-4xl font-bold text-gray-800 mb-6">
        Manage Accounts
    </h1>

    <!-- Button to create a new user -->
    <div class="mb-4 text-center">
        <a href="/createUser">
            <button
                class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50">
                Create User
            </button>
        </a>
    </div>

    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-black text-white">
            <tr>
                <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >First Name</th>
                <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >Last Name</th>
                <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >Username</th>
                <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >User Type</th>
                <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >Actions</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            {#each users as user}
                <Account {user} {deleteUser} {recoverUser} />
            {/each}
        </tbody>
    </table>
</main>
