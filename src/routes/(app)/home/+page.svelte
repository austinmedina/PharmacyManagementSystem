<script>
    let message = "Empowering Pharmacy Staff for Better Health!";
    let subMessage = "Your dedication makes a difference every day.";
</script>

<main>
    <div class="container">
        <h1>{message}</h1>
        <p class="subheading">{subMessage}</p>
        <div class="content">
            <p>
                Pharmacy staff are the heart of healthcare delivery. Your
                efforts ensure that customers receive the best care, and we are
                here to support you in every step.
            </p>
            <img src="/home.webp" alt="Coming Soon" class="image" />
        </div>
    </div>
</main>

<style>
    main {
        display: flex;
        justify-content: center;
    }

    .container {
        text-align: center;
        margin-top: 0;
    }

    h1 {
        font-size: 2.5rem;
        color: white;
        margin-bottom: 10px;
    }

    .subheading {
        font-size: 1.25rem;
        color: white;
        margin-bottom: 10px;
    }

    p {
        font-size: 1rem;
        color: white;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin: auto;
    }

    .image {
        max-width: 600px;
        height: auto;
        margin-top: 10px;
    }
</style>
