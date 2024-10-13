<script lang="ts">
    import type {Prescription} from "$lib/types";
    export let data: Prescription;
</script>

<div
    class="flex flex-col justify-around items-center bg-neutral-100 rounded-3xl">
    <p>Prescription ID: {data.id}</p>
    <p>Patient: {data.patient.firstName + " " + data.patient.lastName}</p>
    <p>Drug: {data.product.name}</p>
    <p>Drug ID: {data.product.id}</p>
    <p>Quantity: {data.quantity}</p>
    <p>Period: {data.period}</p>
</div>
