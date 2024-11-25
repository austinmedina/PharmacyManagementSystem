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

    // generate a random integer between min and max
    function getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateRandomCharacters(length: number) {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*-+=:;/?~}{][|"; // Adjust character set as needed
        return Array.from({length}, () =>
            characters.charAt(Math.floor(Math.random() * characters.length))
        ).join("");
    }

    // random pill stuff, applies individual random styles and a class to each pill div
    function generateRandomPillStyle() {
        return {
            left: `${getRandomInt(0, 100)}%`,
            animationDelay: `${getRandomInt(0, 10)}s`,
            animationDuration: `${getRandomInt(5, 10)}s`,
            index: "-2",
            content: generateRandomCharacters(getRandomInt(20, 30))
        };
    }

    let pillStyles = Array.from({length: 100}, () => generateRandomPillStyle()); // generate 15 random pill styles
</script>

<div class="pill-wrapper">
    {#each pillStyles as style}
        <div
            class="pill"
            style="left: {style.left}; 
                    animation-delay: {style.animationDelay}; 
                    animation-duration: {style.animationDuration}; 
                    z-index: {style.index};
                    background: #000000">
            <span class="pill-content">{style.content}</span>
        </div>
    {/each}
</div>

<body>
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

        <form method="POST" action="/profile" class="form-container">
            <div class="form-field">
                <label for="password">Current Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    bind:value={password} />
            </div>
            <div class="form-field">
                <label for="new-password">New Password:</label>
                <input
                    type="password"
                    id="new-password"
                    name="new-password"
                    bind:value={newPassword} />
            </div>
            <div class="form-field">
                <label for="confirm-new-password">Confirm New Password:</label>
                <input
                    type="password"
                    id="confirm-new-password"
                    name="confirm-new-password"
                    bind:value={confirmNewPassword} />
            </div>
            <button type="submit" class="submit-btn">Save</button>
        </form>

        {#if form?.success}
            <p id="newUser" class="fade-in-out success-message">
                {form?.message}
            </p>
        {:else if form?.error === 1}
            <p id="errorUser" class="error-message">
                New Password creation failed. Please try again. {form?.message}
            </p>
        {/if}
    </main>
</body>

<style>
    body {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        width: 100vw;
        margin: 0;
    }

    .pill-wrapper {
        position: absolute; /* so the pills don't affect the login form */
        width: 100%; /* make the pills full width */
        height: 100%; /* make the pills full height */
    }

    .pill {
        display: inline-block;
        position: absolute; /* so the pill are able to be horizontally spread out */
        top: -500px; /* start the pills above the screen */ /* important because pills have a start delay so pills will be sitting there awkwardly */
        animation: fallingPill 5s linear infinite;
    }

    .pill-content {
        /* text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00; */
        filter: brightness(1.5); /* Increases brightness */
        writing-mode: vertical-rl; /* Makes text flow top to bottom */
        text-orientation: upright; /* Keeps characters upright */
        color: #08801a; /* Adjust color as needed */
        font-weight: bold;
        font-size: 1rem; /* Adjust font size as needed */
    }

    @keyframes fallingPill {
        0% {
            transform: translateY(-10%);
        }
        100% {
            transform: translateY(100vh);
        }
    }

    main {
        max-width: 400px;
        padding: 1.5rem;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        box-sizing: border-box;
        z-index: 1;
        margin-top: 50px;
    }

    h1 {
        text-align: center;
        color: #333;
        font-size: 2rem;
        margin-bottom: 1.5rem;
    }

    .alert-info {
        background-color: #fffae6;
        border-left: 5px solid #ffcc00;
        padding: 1rem;
        margin-bottom: 1rem;
        color: #333;
    }

    .exit-warning {
        background-color: #f8d7da;
        border-left: 5px solid #e53e3e;
        padding: 1rem;
        margin-bottom: 1rem;
        color: #333;
        font-weight: bold;
    }

    .form-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .form-field {
        display: flex;
        flex-direction: column;
    }

    label {
        font-size: 1rem;
        margin-bottom: 0.5rem;
        color: #555;
    }

    input {
        padding: 0.8rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }

    input:focus {
        border-color: #3b82f6;
        outline: none;
    }

    .submit-btn {
        padding: 0.8rem;
        background-color: #3b82f6;
        border: none;
        border-radius: 4px;
        color: #fff;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .submit-btn:hover {
        background-color: #2563eb;
    }

    .success-message {
        text-align: center;
        color: #16a34a;
        font-weight: bold;
    }

    .error-message {
        text-align: center;
        color: #e53e3e;
        font-weight: bold;
    }

    .fade-in-out {
        animation: fadeInOut 3s ease-out forwards;
    }

    @keyframes fadeInOut {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
</style>
