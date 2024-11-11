<script lang="ts">
    import "../../app.css";
    import ManagerNavbar from "$lib/components/navbars/managerNavbar.svelte";
    import CashierNavbar from "$lib/components/navbars/cashierNavbar.svelte";
    import PharmacistNavbar from "$lib/components/navbars/pharmacistNavbar.svelte";
    import TechNavbar from "$lib/components/navbars/techNavbar.svelte";
    import Footer from "$lib/components/footer.svelte";

    import {UserType} from "$lib/types";
    export let data;
    let inventory = data.inventory;
</script>

<main class="mb-8">
    <div
        class="fixed z-[-2] top-0 left-0 h-screen w-screen bg-gradient-to-b from-cyan-400 to-indigo-300">
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

    <slot />

    <Footer />
</main>
