<script>
    import Icon from '@iconify/svelte';

    let firstName = '';
    let lastName = '';
    let username = '';
    let password = '';
    let userType = '';

    
    function createAccount() {
        // JUST A CHECK FOR NOW - replace when have backend
        console.log({ firstName, lastName, username, password, userType });
    }
</script>
<main class = "flex flex-col mx-auto w-1/2 border-2 border-green-500 rounded-lg px-2 py-1">
    <h1 class="text-center text-4xl my-8 ">Create an Account</h1>

    <form on:submit|preventDefault={createAccount} class="flex flex-col gap-4 mb-8">
        <div class="flex justify-evenly items-center gap-4">
            <div class="flex flex-col">
                <label for="firstName" class="text-lg">First Name</label>
                <input id="firstName" type="text" bind:value={firstName} class="border-2 border-neutral-500 rounded-lg px-2 py-1" required>
            </div>
            <div class="flex flex-col">
                <label for="lastName" class="text-lg">Last Name</label>
                <input id="lastName" type="text" bind:value={lastName} class="border-2 border-neutral-500 rounded-lg px-2 py-1" required>
            </div>
        </div>

        <div class="flex flex-col mx-auto w-1/2">
            <label for="username" class="text-lg">Username</label>
            <input id="username" type="text" bind:value={username} class="border-2 border-neutral-500 rounded-lg px-2 py-1" required>
        </div>

        <div class="flex flex-col mx-auto w-1/2">
            <label for="password" class="text-lg">Password</label>
            <input id="password" type="text" bind:value={password} class="border-2 border-neutral-500 rounded-lg px-2 py-1" required>
        </div>

        <div class="flex flex-col mx-auto w-1/2">
            <label for="userType" class="text-lg">User Type</label>
            <select id="userType" bind:value={userType} class="border-2 border-neutral-500 rounded-lg px-2 py-1" required>
                <option value="" disabled selected>Select User Type</option>
                <option value= 1>Pharmacist</option>
                <option value= 2>Cashier</option>
                <option value= 3>Pharmacy Technician</option>
                <option value= 4>Pharmacy Manager</option>
            </select>
        </div>

        <div class="flex justify-center mt-4">
            <button type="submit" class="bg-purple-700 hover:text-purple-300 py-2 px-6 text-white text-xl rounded-xl">Create Account</button>
        </div>
    </form>
</main>