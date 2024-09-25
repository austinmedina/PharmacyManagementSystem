<script>
    import "../app.css";
</script>

<!-- Manager -->
 <h1>Manager</h1>
<nav class="flex justify-between p-2 mb-2 bg-blue-300">
    <h1>Insert LOGO HERE</h1>
    <div class="flex justify-evenly gap-8">
        <h2>View Patients</h2>
        <h2>Account Manager</h2>
        <h2>Inventory</h2>
        <h2>Reports</h2>
        <h2>Logs</h2>
    </div>
    <span class="text-sm">LOGOUT</span>
</nav>

<!-- Pharmacist -->
 <h1>Pharmacist</h1>
<nav class="flex justify-between p-2 mb-2 bg-blue-300">
    <h1>Insert LOGO HERE</h1>
    <div class="flex justify-evenly gap-8">
        <h2>View Patients</h2>
        <h2>Fullfill Prescriptions</h2>
        <h2>Inventory</h2>
        <h2>Reports</h2>
        <h2>Logs</h2>
    </div>
    <span class="text-sm">LOGOUT</span> 
</nav>

<!-- Pharmacy Tech -->
 <h1>Pharmacy Tech</h1>
<nav class="flex justify-between p-2 mb-2 bg-blue-300">
    <h1>Insert LOGO HERE</h1>
    <div class="flex justify-evenly gap-8">
        <h2>Checkout</h2>
        <h2>Enter Prescriptions</h2>
        <h2>Logs</h2>
    </div>
    <span class="text-sm">LOGOUT</span>
</nav>

<!-- Cashier -->
 <h1>Cashier</h1>
<nav class="flex justify-between p-2 bg-blue-300">
    <h1>Insert LOGO HERE</h1>
    <div class="flex justify-evenly gap-8">
        <h2>Checkout</h2>
        <h2>Logs</h2>
    </div>
    <span class="text-sm">LOGOUT</span>
</nav>

<slot />

