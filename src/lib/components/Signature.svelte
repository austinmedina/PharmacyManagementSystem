<!-- The following HTML and TS are a combination of dialog component from https://dev.to/myleftshoe/svelte-dialogs-the-easy-way-e0f 
     and a signature package from https://github.com/captaincodeman/svelte-signature-pad 
     I (Austin) added in the logic to make these static components function for our need -->
<script lang="ts">
    import {signature} from "svelte-signature-pad";
    import Icon from "@iconify/svelte";
    export let signatureForm: HTMLDialogElement;
    export let onSign;

    let layers: {path: string; width: number; height: number}[] = [];

    let width: number;
    let height: number;
    let preview: string;

    const ondraw = (path: string) => (preview = path);
    const oncomplete = (path: string) => {
        preview = "";
        layers = [...layers, {width, height, path}];
    };

    const clear = () => {
        layers = [];
    };
</script>

<dialog bind:this={signatureForm}>
    <button
        class="absolute top-4 right-4 text-sm text-gray-800"
        on:click={() => signatureForm.close()}>
        <Icon icon="carbon:close-filled" class="text-3xl hover:text-red-500" />
    </button>
    <div
        class="relative w-full h-[360px] bg-gray-100 border rounded-3xl border-gray-800 flex flex-col justify-center items-center">
        <div
            class="absolute left-4 right-4 bottom-24 border-t border-dotted border-gray-800" />
        <div
            class="w-full h-full"
            use:signature={{ondraw, oncomplete}}
            bind:clientWidth={width}
            bind:clientHeight={height}
            on:touchmove|preventDefault={() => false}>
            {#each layers as layer}
                <svg
                    class="absolute w-full h-full fill-black pointer-events-none"
                    viewBox="0 0 {layer.width} {layer.height}">
                    <path d={layer.path} />
                </svg>
            {/each}

            {#if preview}
                <svg
                    class="absolute w-full h-full fill-gray-900 pointer-events-none"
                    viewBox="0 0 {width} {height}">
                    <path d={preview} />
                </svg>
            {/if}
        </div>
        <button
            class="absolute top-2 right-2 px-4 py-2 text-sm text-gray-500 bg-white border border-gray-500 rounded-xl"
            on:click={clear}>Clear</button>
        <button
            class="absolute bottom-2 right-2 px-4 py-2 text-sm text-gray-500 bg-white border border-gray-500 rounded-xl"
            on:click={onSign()}>Sign</button>
    </div>

    <p class="mt-2 text-sm text-center">
        Please sign on the dotted line to indicate that you agree to all the
        legal terms we all know you didn't read. Thank you!
    </p>
</dialog>

<style>
    dialog:modal {
        background-color: #e0f2f1;
        width: 50%;
        height: 66.67%;
        padding: 1rem;
        border-radius: 1.5rem;
        box-shadow:
            0 4px 6px rgba(0, 0, 0, 0.1),
            0 10px 15px rgba(0, 0, 0, 0.1);
        border: 2px solid #90caf9;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>
