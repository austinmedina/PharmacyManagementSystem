<script lang="ts">
    import Icon from "@iconify/svelte";
</script>

<div
    class="footer w-full bg-gray-100 text-gray-800 py-6 px-8 border-t border-gray-300 flex justify-between items-center text-sm">
    <div class="flex items-center space-x-4">
        <Icon icon="mdi:pill" class="text-blue-400 w-10 h-10" />
        <div class="flex flex-col justify-center">
            <h1 class="text-lg font-semibold">Legacy Pharmacy</h1>
            <a
                href="https://www.legacypharmacy.com"
                class="text-blue-500 hover:underline flex items-center space-x-1">
                <Icon icon="mdi:web" class="text-blue-500 w-5 h-5" />
                <span>Visit Website</span>
            </a>
        </div>
    </div>

    <div class="grid grid-cols-2 gap-4 items-center">
        <div class="flex items-center space-x-2">
            <Icon icon="mdi:map-marker" class="text-red-600 w-5 h-5" />
            <p>1600 Amphitheatre Parkway, Mountain View, CA</p>
        </div>
        <div class="flex items-center space-x-2">
            <Icon icon="mdi:office-building" class="text-gray-700 w-5 h-5" />
            <p>Legacy Holding Company</p>
        </div>
        <div class="flex items-center space-x-2">
            <Icon icon="mdi:phone" class="text-blue-500 w-5 h-5" />
            <p>1-800-255-3700</p>
        </div>
        <div class="flex items-center space-x-2">
            <Icon icon="mdi:clock-outline" class="text-yellow-500 w-5 h-5" />
            <p>Mon-Fri 10am-4pm</p>
        </div>
    </div>
</div>
