<script lang="ts">
    import {fade} from "svelte/transition";

    let firstName = "";
    let lastName = "";
    let username = "";
    let password = "";
    let userType = "";
    export let form;
</script>

<main
    in:fade={{delay: 400}}
    out:fade
    class="flex flex-col mx-auto w-full max-w-2xl bg-gradient-to-br from-blue-400 to-purple-700 shadow-xl rounded-lg border border-black p-6 mt-10">
    <h1 class="text-center text-4xl font-bold text-white my-6">
        Create Account
    </h1>
    <!-- Form that manager fills out to create a new user -->
    <form
        method="post"
        action="/createUser"
        class="flex flex-col gap-6 bg-white p-8 rounded-lg shadow-md">
        <!-- First and Last Name Boxes -->
        <div class="flex flex-col md:flex-row justify-between gap-4">
            <div class="flex-1">
                <label
                    for="firstName"
                    class="block text-sm font-medium text-gray-800 mb-2"
                    >First Name</label>
                <input
                    name="firstName"
                    type="text"
                    bind:value={firstName}
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required />
            </div>
            <div class="flex-1">
                <label
                    for="lastName"
                    class="block text-sm font-medium text-gray-800 mb-2"
                    >Last Name</label>
                <input
                    name="lastName"
                    type="text"
                    bind:value={lastName}
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required />
            </div>
        </div>

        <!-- Username Box -->
        <div class="flex flex-col">
            <label
                for="username"
                class="block text-sm font-medium text-gray-800 mb-2"
                >Username</label>
            <input
                name="username"
                type="text"
                bind:value={username}
                class="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required />
        </div>

        <!-- Password Box  -->
        <div class="flex flex-col">
            <label
                for="password"
                class="block text-sm font-medium text-gray-800 mb-2"
                >Password</label>
            <input
                name="password"
                type="password"
                bind:value={password}
                class="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required />
        </div>

        <!-- User Type Box/dropdown -->
        <div class="flex flex-col">
            <label
                for="userType"
                class="block text-sm font-medium text-gray-800 mb-2"
                >User Type</label>
            <select
                name="userType"
                bind:value={userType}
                class="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required>
                <option value="" disabled selected>Select User Type</option>
                <option value="0">Pharmacy Manager</option>
                <option value="1">Pharmacist</option>
                <option value="2">Cashier</option>
                <option value="3">Pharmacy Technician</option>
            </select>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center mt-4">
            <button
                type="submit"
                class="bg-gradient-to-r from-purple-700 to-pink-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-2 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                Create Account
            </button>
        </div>

        <!-- Feedback Messages, if is a valid account then user is created if not error appears on screen and boxes are emptied -->
        {#if form?.success}
            <p id="newUser" class="text-center text-green-700 mt-4 fade-in-out">
                {form?.message}
            </p>
        {:else if form?.error === 1}
            <p id="errorUser" class="text-center text-red-700 mt-4">
                {form?.message}
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
