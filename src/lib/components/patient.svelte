<script lang="ts">
    export let patient;
    export let onPatientRemoved;
    export let form;
    import Icon from "@iconify/svelte";

    const removePatient = async (patientID: number, patientName: string) => {
        try {
            const response = await fetch("/api/patient", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({patientId: patientID})
            });

            if (!response.ok) {
                throw new Error("Failed to delete patient");
            } else {
                console.log(`Patient with ID ${patientID} has been deleted.`);
                expanded = false;
                onPatientRemoved(patientName);
            }
        } catch (error) {
            console.error(
                `Error deleting patient: ${error instanceof Error ? error.message : "An unknown error occurred."}`
            );
        }
    };

    let editFormRef: HTMLFormElement | null = null;
    let expanded = false;
    let edit = false;
    let firstName: string;
    let lastName: string;
    let dateOfBirth: string;
    let email: string;
    let phone: string;
    let address: string;
    let insurance: boolean;

    if (form?.values?.id === patient.id) {
        edit =
            form?.errors && form?.errors.formKey == "editPatient"
                ? true
                : false;
        expanded =
            form?.errors && form?.errors.formKey == "editPatient"
                ? true
                : false;

        firstName = form?.values?.firstName || patient.firstName;
        lastName = form?.values?.lastName || patient.lastName;
        dateOfBirth =
            form?.values?.dateOfBirth ||
            new Date(patient.dateOfBirth).toISOString().split("T")[0];
        email = form?.values?.email || patient.email;
        phone = (form?.values?.phone || patient.phone).replace(
            /(\d{3})(\d{3})(\d{4})/,
            "$1-$2-$3"
        );
        address = form?.values?.address || patient.address;
        insurance = form?.values?.insurance || patient.insurance;
    } else {
        edit = false;
        expanded = false;
        firstName = patient.firstName;
        lastName = patient.lastName;
        dateOfBirth = new Date(patient.dateOfBirth).toISOString().split("T")[0];
        email = patient.email;
        phone = patient.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        address = patient.address;
        insurance = patient.insurance;
    }

    const resetPatient = (): void => {
        edit = false;
        firstName = patient.firstName;
        lastName = patient.lastName;
        dateOfBirth = new Date(patient.dateOfBirth).toISOString().split("T")[0];
        email = patient.email;
        phone = patient.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        insurance = patient.insurance;
    };

    //I did not come up with this. I found this on sveltes playground website: https://svelte.dev/playground/cb0b845fce1a43aabf4421989acaca39?version=3.55.1
    function resizeInputOnDynamicContent(node: HTMLInputElement) {
        const measuringElement = document.createElement("div");
        document.body.appendChild(measuringElement);

        /** duplicate the styles of the existing node, but
		remove the measuring element from the viewport. */
        function duplicateAndSet() {
            const styles = window.getComputedStyle(node);
            measuringElement.innerHTML = node.value;
            measuringElement.style.fontSize = styles.fontSize;
            measuringElement.style.fontFamily = styles.fontFamily;
            measuringElement.style.paddingLeft = styles.paddingLeft;
            measuringElement.style.paddingRight = styles.paddingRight;
            measuringElement.style.boxSizing = "border-box";
            measuringElement.style.border = styles.border;
            measuringElement.style.width = "max-content";
            measuringElement.style.position = "absolute";
            measuringElement.style.top = "0";
            measuringElement.style.left = "-9999px";
            measuringElement.style.overflow = "hidden";
            measuringElement.style.visibility = "hidden";
            measuringElement.style.whiteSpace = "pre";
            measuringElement.style.height = "0";
            node.style.width = `${measuringElement.offsetWidth + 5}px`;
        }

        duplicateAndSet();
        /** listen to any style changes */
        const observer = new MutationObserver(duplicateAndSet);
        observer.observe(node, {
            attributes: true,
            childList: true,
            subtree: true
        });

        node.addEventListener("input", duplicateAndSet);
        return {
            destroy() {
                observer.disconnect();
                node.removeEventListener("input", duplicateAndSet);
            }
        };
    }
</script>

<div class="flex-col bg-neutral-200 p-4 rounded-3xl">
    <form method="POST" bind:this={editFormRef}>
        <div
            id="patientHeader"
            class="flex w-full justify-between items-center">
            {#if !edit}
                <button
                    class="text-left flex-1"
                    on:click|preventDefault={() => {
                        expanded = !expanded;
                        resetPatient();
                    }}>
                    <strong
                        >{patient.firstName + " " + patient.lastName}</strong>
                </button>
                <button
                    class="text-right bg-purple-500 hover:bg-red-700 text-white py-1 px-4 rounded-xl"
                    on:click|preventDefault={() =>
                        removePatient(
                            patient.id,
                            patient.firstName + " " + patient.lastName
                        )}>
                    Remove Patient
                </button>
            {:else}
                <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    bind:value={firstName}
                    class={`text-left flex-1 inline-block bg-neutral-200 ${edit ? "border border-black rounded-xl p-1 m-1" : "border-none"}`} />
                <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    bind:value={lastName}
                    class={`text-left flex-1 inline-block bg-neutral-200 ${edit ? "border border-black rounded-xl p-1 m-1" : "border-none"}`} />
            {/if}
        </div>
        {#if expanded}
            <div class="text-left mt-2 ml-8">
                <div class="flex justify-between items-center">
                    <input
                        id="id"
                        name="id"
                        type="text"
                        bind:value={patient.id}
                        hidden />
                    <p class="flex-1">
                        {#if form?.errors?.dateOfBirth && form?.errors.formKey == "editPatient"}
                            <p class="text-red-500 text-sm">
                                {form.errors.dateOfBirth}
                            </p>
                        {/if}
                        <strong>Date of Birth:</strong>
                        <input
                            id="dob"
                            name="dateOfBirth"
                            type="date"
                            bind:value={dateOfBirth}
                            class={`text-left flex-1 bg-neutral-200 ${edit ? "border border-black rounded-xl p-1 m-1" : "border-none"}`}
                            disabled={!edit} />
                    </p>
                    <div class="inline-block text-right space-x-2">
                        {#if !edit}
                            <button
                                on:click|preventDefault={() => (edit = true)}>
                                <Icon
                                    icon="mdi:pencil"
                                    class="w-6 h-6 text-orange-500" />
                            </button>
                        {:else}
                            <button
                                on:click|preventDefault={() => {
                                    editFormRef?.submit();
                                }}>
                                <Icon
                                    icon="mdi:check"
                                    class="w-6 h-6 text-green-500" />
                            </button>
                            <button
                                on:click|preventDefault={() => {
                                    resetPatient();
                                }}>
                                <Icon
                                    icon="mdi:close"
                                    class="w-6 h-6 text-red-500" />
                            </button>
                        {/if}
                    </div>
                </div>
                <p>
                    {#if form?.errors?.email && form?.errors.formKey == "editPatient"}
                        <p class="text-red-500 text-sm">{form.errors.email}</p>
                    {/if}
                    <strong>Email:</strong>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        bind:value={email}
                        use:resizeInputOnDynamicContent
                        class={`text-left flex-1 bg-neutral-200 max-w-full overflow-hidden whitespace-normal ${edit ? "border border-black rounded-xl p-1 m-1" : "border-none"}`}
                        disabled={!edit} />
                </p>
                <p>
                    {#if form?.errors?.phone && form?.errors.formKey == "editPatient"}
                        <p class="text-red-500 text-sm">{form.errors.phone}</p>
                    {/if}
                    <strong>Phone:</strong>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        bind:value={phone}
                        use:resizeInputOnDynamicContent
                        class={`text-left flex-1 bg-neutral-200 max-w-full overflow-hidden whitespace-normal ${edit ? "border border-black rounded-xl p-1 m-1" : "border-none"}`}
                        disabled={!edit} />
                </p>
                <p>
                    {#if form?.errors?.address && form?.errors.formKey == "editPatient"}
                        <p class="text-red-500 text-sm">
                            {form.errors.address}
                        </p>
                    {/if}
                    <strong>Address:</strong>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        bind:value={address}
                        use:resizeInputOnDynamicContent
                        class={`text-left flex-1 bg-neutral-200 max-w-full overflow-hidden whitespace-normal ${edit ? "border border-black rounded-xl p-1 m-1" : "border-none"}`}
                        disabled={!edit} />
                </p>
                <p>
                    {#if form?.errors?.insurance && form?.errors.formKey == "editPatient"}
                        <p class="text-red-500 text-sm">
                            {form.errors.insurance}
                        </p>
                    {/if}
                    <strong>Insurance:</strong>
                    <input
                        id="insurance"
                        name="insurance"
                        type="checkbox"
                        bind:checked={insurance}
                        class={`text-left flex-1 bg-neutral-200 ${edit ? "border border-black rounded-xl p-1 m-1" : "border-none"}`}
                        disabled={!edit} />
                </p>
            </div>
        {/if}
    </form>
</div>
