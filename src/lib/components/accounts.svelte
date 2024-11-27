<script>
    import {UserType} from "$lib/types";

    export let user;
    export let deleteUser;
    export let recoverUser;
</script>

<!-- This is essentially a row being created for each user in the manage accounts table-->
<tr>
    {#if user}
        <td class="px-6 py-4 whitespace-nowrap">{user.firstName}</td>
        <td class="px-6 py-4 whitespace-nowrap">{user.lastName}</td>
        <td class="px-6 py-4 whitespace-nowrap">{user.username}</td>
        <td class="px-6 py-4 whitespace-nowrap">{UserType[user.type]}</td>
        <td class="px-6 py-4 whitespace-nowrap">
            <button
                on:click={() => recoverUser(user.id)}
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 mr-2">
                Recover
            </button>
            <button
                on:click={() => deleteUser(user.id)}
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50">
                Delete
            </button>
        </td>
    {:else}
        <td class="px-6 py-4 whitespace-nowrap" colspan="5"
            >No user data available</td>
    {/if}
</tr>
