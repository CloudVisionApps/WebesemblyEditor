<template>
    <div>
        <RadioGroup v-model="currentDevice" v-on:update:modelValue="switchDevice">
            <RadioGroupLabel class="sr-only"> Choose a browser option </RadioGroupLabel>
            <div class="relative z-0 inline-flex mt-1.5">
                <RadioGroupOption as="template" v-for="option in deviceSwitchOptions" :key="option.name" :value="option.name" :disabled="!option.isActive" v-slot="{ active, checked }">
                    <div :class="[option.isActive ? 'cursor-pointer focus:outline-none' : 'opacity-25 cursor-not-allowed', active ? '' : '', checked ? 'bg-gray-100 text-blue-500' : 'bg-white text-blue-600 hover:bg-gray-50', 'rounded px-2.5 py-1.5 items-center justify-center text-sm font-medium uppercase']">
                        <RadioGroupLabel as="p">
                            <component :is="option.icon"  :class="[checked ? 'text-blue-400':'text-gray-300', 'flex-shrink-0 h-5 w-5']" aria-hidden="true" />
                        </RadioGroupLabel>
                    </div>
                </RadioGroupOption>
            </div>
        </RadioGroup>
    </div>
</template>

<script>
import { ref } from 'vue'
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'


import { DesktopComputerIcon, DeviceTabletIcon, DeviceMobileIcon } from '@heroicons/vue/outline'

const deviceSwitchOptions = [
    { name: 'Desktop', icon: 'DesktopComputerIcon', isActive: true },
    { name: 'Tablet', icon: 'DeviceTabletIcon', isActive: true },
    { name: 'Phone', icon: 'DeviceMobileIcon', isActive: true },
];

export default {
    props: [],
    emits: [],
    components: {
        RadioGroup,
        RadioGroupLabel,
        RadioGroupOption,
        DesktopComputerIcon, DeviceTabletIcon, DeviceMobileIcon
    },
    methods: {
        switchDevice: function () {

            let liveEditEvent = new CustomEvent('JsLiveEdit::SwitchDevice', {
                detail: {
                    device: this.currentDevice
                }
            })
            document.dispatchEvent(liveEditEvent);
        }
    },
    data() {
        let currentDevice = ref(deviceSwitchOptions[0].name);
        return {
            deviceSwitchOptions:deviceSwitchOptions,
            currentDevice: currentDevice
        }
    }
}
</script>
