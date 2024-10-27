<script>
    import "../app.css";
    import ManagerNavbar from "$lib/components/navbars/managerNavbar.svelte";
    import CashierNavbar from "$lib/components/navbars/cashierNavbar.svelte";
    import PharmacistNavbar from "$lib/components/navbars/pharmacistNavbar.svelte";
    import TechNavbar from "$lib/components/navbars/techNavbar.svelte";
</script>

<main class="mb-8">
    <div
        class="fixed z-[-2] top-0 left-0 h-screen w-screen bg-gradient-to-tr from-cyan-400 to-indigo-500">
    </div>
    <ManagerNavbar />
    <CashierNavbar />
    <PharmacistNavbar />
    <TechNavbar />

    <slot />
</main>
