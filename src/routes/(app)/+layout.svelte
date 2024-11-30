<script lang="ts">
    import {page} from "$app/stores";
    import {onDestroy} from "svelte";
    import "../../app.css";
    import ManagerNavbar from "$lib/components/navbars/managerNavbar.svelte";
    import CashierNavbar from "$lib/components/navbars/cashierNavbar.svelte";
    import PharmacistNavbar from "$lib/components/navbars/pharmacistNavbar.svelte";
    import TechNavbar from "$lib/components/navbars/techNavbar.svelte";
    import Footer from "$lib/components/footer.svelte";

    import {UserType} from "$lib/types";

    export let data;
    let inventory = data.inventory;
    let isProfileSelected = false;

    // Watch the current route to detect if "profile" is active
    const unsubscribe = page.subscribe(($page) => {
        if ($page.url.pathname === "/profile") {
            isProfileSelected = true;
        } else {
            isProfileSelected = false;
        }
    });

    onDestroy(() => {
        unsubscribe(); // Cleanup when the component is destroyed
    });
</script>

<main class="flex flex-col min-h-screen">
    <div
        class="fixed z-[-2] top-0 left-0 h-screen w-screen"
        style="background: {isProfileSelected
            ? '#000000'
            : 'linear-gradient(to bottom, #06b6d4, #6366f1)'}">
    </div>

    {#if data.userType === UserType.Manager}
        <ManagerNavbar {inventory} />
    {:else if data.userType === UserType.Cashier}
        <CashierNavbar />
    {:else if data.userType === UserType.Pharmacist}
        <PharmacistNavbar {inventory} />
    {:else if data.userType === UserType.Technician}
        <TechNavbar />
    {/if}

    <div class="flex-1 mb-8">
        <slot />
    </div>

    <Footer />
</main>
