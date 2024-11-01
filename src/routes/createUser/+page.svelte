<script lang="ts">
    let firstName = "";
    let lastName = "";
    let username = "";
    let password = "";
    let userType = "";
    export let form;
</script>

<main
    class="flex flex-col mx-auto w-1/2 border-2 border-green-500 rounded-lg px-2 py-1">
    <h1 class="text-center text-4xl my-8">Create an Account</h1>

    <form method="post" action="/createUser" class="flex flex-col gap-4 mb-8">
        <div class="flex justify-evenly items-center gap-4">
            <div class="flex flex-col">
                <label for="firstName" class="text-lg">First Name</label>
                <input
                    name="firstName"
                    type="text"
                    bind:value={firstName}
                    class="border-2 border-neutral-500 rounded-lg px-2 py-1"
                    required />
            </div>
            <div class="flex flex-col">
                <label for="lastName" class="text-lg">Last Name</label>
                <input
                    name="lastName"
                    type="text"
                    bind:value={lastName}
                    class="border-2 border-neutral-500 rounded-lg px-2 py-1"
                    required />
            </div>
        </div>

        <div class="flex flex-col mx-auto w-1/2">
            <label for="username" class="text-lg">Username</label>
            <input
                name="username"
                type="text"
                bind:value={username}
                class="border-2 border-neutral-500 rounded-lg px-2 py-1"
                required />
        </div>

        <div class="flex flex-col mx-auto w-1/2">
            <label for="password" class="text-lg">Password</label>
            <input
                name="password"
                type="text"
                bind:value={password}
                class="border-2 border-neutral-500 rounded-lg px-2 py-1"
                required />
        </div>

        <div class="flex flex-col mx-auto w-1/2">
            <label for="userType" class="text-lg">User Type</label>
            <select
                name="userType"
                bind:value={userType}
                class="border-2 border-neutral-500 rounded-lg px-2 py-1"
                required>
                <option value="" disabled selected>Select User Type</option>
                <option value="0">Pharmacy Manager</option>
                <option value="1">Pharmacist</option>
                <option value="2">Cashier</option>
                <option value="3">Pharmacy Technician</option>
            </select>
        </div>

        <div class="flex justify-center mt-4">
            <button
                type="submit"
                class="bg-purple-700 hover:text-purple-300 py-2 px-6 text-white text-xl rounded-xl"
                >Create Account</button>
        </div>

        {#if form?.success}
            <p id="newUser" class="fade-in-out">{form?.message}</p>
        {:else if form?.error === 1}
            <p id="errorUser" class="error-message">
                User creation failed. Please try again. {form?.message}
            </p>
        {/if}
    </form>
</main>

<style>
    .fade-in-out {
        opacity: 1;
        animation: fade 5s forwards;
    }

    @keyframes fade {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
</style>
