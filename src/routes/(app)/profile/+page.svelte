<script lang="ts">
    import type {PageData} from "./$types";

    let password = "";
    let newPassword = "";
    let confirmNewPassword = "";
    export let form;

    export let data: PageData;
    let firstTimeLogin = data.firstTimeLogin;
    let formSubmitted = false;
    let showExitWarning = false;

    import {beforeNavigate} from "$app/navigation";

    // Prevents leaving page for first-time users until form is submitted
    if (firstTimeLogin) {
        beforeNavigate((event) => {
            if (!formSubmitted) {
                event.cancel();
                alert("You must submit the form before leaving this page.");
                showExitWarning = true;
            } else {
                showExitWarning = false;
            }
        });
    }

    // Watch for form submission success or failure
    if (form?.success) {
        formSubmitted = true;
        showExitWarning = false;
    } else if (form?.error) {
        formSubmitted = false;
    }
</script>

<main>
    <h1>Profile</h1>
    {#if firstTimeLogin}
        <div class="alert alert-info">
            First-time users must change their password.
        </div>
    {/if}

    {#if showExitWarning}
        <div class="exit-warning">
            You must submit the form before leaving this page.
        </div>
    {/if}

    <form method="POST" action="/profile">
        <div>
            <label for="password">Current Password:</label>
            <input
                type="password"
                id="password"
                name="password"
                bind:value={password} />
        </div>
        <div>
            <label for="new-password">New Password:</label>
            <input
                type="password"
                id="new-password"
                name="new-password"
                bind:value={newPassword} />
        </div>
        <div>
            <label for="confirm-new-password">Confirm New Password:</label>
            <input
                type="password"
                id="confirm-new-password"
                name="confirm-new-password"
                bind:value={confirmNewPassword} />
        </div>
        <button type="submit">Save</button>
    </form>

    {#if form?.success}
        <p id="newUser" class="fade-in-out">{form?.message}</p>
    {:else if form?.error === 1}
        <p id="errorUser" class="error-message">
            New Password creation failed. Please try again. {form?.message}
        </p>
    {/if}
</main>

<style>
    main {
        max-width: 400px;
        margin: 0 auto;
        padding: 1rem;
    }
    div {
        margin-bottom: 1rem;
    }
    label {
        display: block;
        margin-bottom: 0.5rem;
    }
    input {
        width: 100%;
        padding: 0.5rem;
        box-sizing: border-box;
    }
</style>
