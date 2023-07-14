<template>
    <div>
        <RadioGroup v-model="currentAlign" v-on:update:modelValue="changeAlign">
            <RadioGroupLabel class="sr-only"> Choose a current option </RadioGroupLabel>
            <div class="relative z-0 inline-flex shadow-sm rounded-md">
                <RadioGroupOption as="template" v-for="option in textAlignOptions" :key="option.name" :value="option" :disabled="!option.isActive" v-slot="{ active, checked }">
                    <div :class="[option.isActive ? 'cursor-pointer focus:outline-none' : 'opacity-25 cursor-not-allowed', active ? 'ring-2 ring-offset-2 ring-indigo-500' : '', checked ? 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50', 'border py-1 px-1 items-center justify-center text-sm font-medium uppercase']">
                        <RadioGroupLabel as="p">
                            {{ option.name }}
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

const textAlignOptions = [
    { name: 'left', isActive: true },
    { name: 'center', isActive: true },
    { name: 'right', isActive: true },
]

export default {
    props: [],
    emits: [],
    components: {
        RadioGroup,
        RadioGroupLabel,
        RadioGroupOption,
    },
    methods: {
        changeAlign: function () {

            this.currentElement.classList.remove('text-right');
            this.currentElement.classList.remove('text-left');
            this.currentElement.classList.remove('text-center');

            if (this.currentAlign.name === 'left') {
                this.currentElement.classList.add('text-left');
            }
            if (this.currentAlign.name === 'right') {
                this.currentElement.classList.add('text-right');
            }
            if (this.currentAlign.name === 'center') {
                this.currentElement.classList.add('text-center');
            }

            let liveEditEvent = new CustomEvent('click', {})
            this.currentElement.dispatchEvent(liveEditEvent);
        }
    },
    mounted() {
        document.addEventListener("JsLiveEdit::ElementChange", (event) => {
           if (event.detail.elementType == 'text') {

               this.currentElement = event.detail.element;
               this.currentAlign = ref();

               if (event.detail.element.classList.contains('text-right')) {
                   this.currentAlign = textAlignOptions.find(option => option.name === 'right');
               }

               if (event.detail.element.classList.contains('text-left')) {
                   this.currentAlign = textAlignOptions.find(option => option.name === 'left');
               }

               if (event.detail.element.classList.contains('text-center')) {
                   this.currentAlign = textAlignOptions.find(option => option.name === 'center');
               }
           }
        });
    },
    data() {
        let currentElement = false;
        let currentAlign = ref();
        return {
            currentElement: currentElement,
            currentAlign: currentAlign,
            textAlignOptions,
        }
    }
}
</script>
