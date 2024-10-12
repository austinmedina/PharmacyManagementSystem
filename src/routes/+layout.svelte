<script>
    import "../app.css";
    import ManagerNavbar from "$lib/components/navbars/managerNavbar.svelte";
    import CashierNavbar from "$lib/components/navbars/cashierNavbar.svelte";
    import PharmacistNavbar from "$lib/components/navbars/pharmacistNavbar.svelte";
    import TechNavbar from "$lib/components/navbars/techNavbar.svelte";
</script>

<ManagerNavbar />
<CashierNavbar />
<PharmacistNavbar />
<TechNavbar />

<slot />
