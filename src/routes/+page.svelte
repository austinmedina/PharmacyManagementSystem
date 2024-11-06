<script lang="ts">
    import {
        validators,
        required,
        maxLength,
        useForm,
        Hint
    } from "svelte-use-form";

    export let form;

    const form2 = useForm();

    // generate a random integer between min and max
    function getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // generate a random hex color, used for the gradient of the pills
    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // random pill stuff, applies individual random styles and a class to each pill div
    function generateRandomPillStyle() {
        return {
            left: `${getRandomInt(0, 100)}%`,
            animationDelay: `${getRandomInt(0, 10)}s`,
            animationDuration: `${getRandomInt(5, 10)}s`,
            index: "10",
            width: `${getRandomInt(20, 100)}px`,
            height: `${getRandomInt(20, 100)}px`,
            rotationDirection:
                getRandomInt(0, 1) === 0 ? "clockwise" : "counterclockwise",
            gradient: `linear-gradient(${getRandomColor()}, ${getRandomColor()})`
        };
    }

    let pillStyles = Array.from({length: 15}, () => generateRandomPillStyle()); // generate 15 random pill styles

    //DOES NOT WORK
    function resetPillStyle(index: number) {
        // reset the pill style to a new random style when animation finishes
        console.log("resetting pill style", index);
        pillStyles[index] = generateRandomPillStyle();
    }
</script>

<body>
    <div class="pill-wrapper">
        {#each pillStyles as style, index}
            <div
                class="pill {style.rotationDirection}"
                style="left: {style.left}; 
                        animation-delay: {style.animationDelay}; 
                        animation-duration: {style.animationDuration}; 
                        z-index: {style.index}; 
                        width: {style.width}; 
                        height: {style.height}; 
                        background: {style.gradient};"
                on:animationend={() => resetPillStyle(index)}>
            </div>
        {/each}
    </div>

    <form use:form2 method="post" action="?/login">
        <div class="info-container">
            <h1>Login</h1>
            <div class="center">
                <input
                    class="username"
                    type="text"
                    maxLength="31"
                    name="username"
                    required
                    autocomplete="off"
                    use:validators={[required, maxLength(31)]} />
                <Hint for="username" on="required" class="hint"
                    >This is a mandatory field</Hint>
            </div>
            <div class="center">
                <input
                    type="password"
                    name="password"
                    maxLength="255"
                    use:validators={[required, maxLength(255)]} />
                <Hint for="password" on="required" class="hint"
                    >This is a mandatory field</Hint>
            </div>
            <div class="center">
                <button disabled={!$form2.valid}>Login</button>
            </div>
            {#if form?.error}
                <div class="center">
                    <pre class="error">{form?.message}</pre>
                </div>
            {/if}
        </div>
    </form>
</body>

<style>
    body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
    }

    .pill-wrapper {
        position: absolute; /* so the pills don't affect the login form */
        width: 100%; /* make the pills full width */
        height: 100%; /* make the pills full height */
    }

    .pill {
        border-radius: 40px; /* make the pills round not square */
        position: absolute; /* so the pill are able to be horizontally spread out */
        top: -100px; /* start the pills above the screen */ /* important because pills have a start delay so pills will be sitting there awkwardly */
    }

    @keyframes fallingPill {
        0% {
            transform: translateY(-10%) rotate(0deg);
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
        }
    }

    .pill.clockwise {
        animation: fallingPillClockwise 5s linear infinite;
    }

    .pill.counterclockwise {
        animation: fallingPillCounterclockwise 5s linear infinite;
    }

    @keyframes fallingPillClockwise {
        0% {
            transform: translateY(-10%) rotate(0deg);
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
        }
    }

    @keyframes fallingPillCounterclockwise {
        0% {
            transform: translateY(-10%) rotate(0deg);
        }
        100% {
            transform: translateY(100vh) rotate(-360deg);
        }
    }

    .info-container {
        background: linear-gradient(270deg, #ff6b6b, #f7c6c7, #6c8aec, #c2e9fb);
        z-index: 1;
        background-size: 800% 800%;
        background-color: #f0f0f0;
        border-radius: 15px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        padding: 30px;
        width: 400px;
        text-align: center;
        transition: transform 0.3s ease-in-out;
        opacity: 0;
        animation:
            fadeIn 3s forwards,
            gradientAnimation 10s ease infinite;
    }

    @keyframes gradientAnimation {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    h1 {
        font-size: 24px;
        color: #333;
        margin: 0 0 20px 0;
    }

    .center {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 8px;
        margin: auto;
    }

    input {
        width: 100%;
        padding: 12px;
        margin: 8px 0;
        border: 1px solid #ccc;
        border-radius: 8px;
        transition: all 0.3s ease;
    }

    input:focus {
        border-color: #007bff;
        box-shadow: 0 0 8px rgba(0, 123, 255, 0.6);
        outline: none;
        background-color: #f9f9ff;
    }

    .hint {
        color: #666;
        font-size: 0.9em;
        margin-top: 4px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    button {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        background: linear-gradient(135deg, #6a11cb, #2575fc);
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        transition:
            background 0.3s ease,
            transform 0.2s;
    }

    button:hover {
        background: linear-gradient(135deg, #2575fc, #6a11cb);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }

    button:active {
        transform: scale(0.98);
    }

    .error {
        color: #ff4c4c;
        background-color: #ffdddd;
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
        max-width: 90%;
        width: auto;
        text-align: center;
        word-wrap: break-word;
        white-space: pre-wrap;
        animation: slideIn 1s ease-out;
    }

    @keyframes slideIn {
        from {
            transform: translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
</style>
