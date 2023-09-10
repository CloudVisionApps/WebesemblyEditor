<template>

<!--
 <div>
        <div class="flex-1 flex items-center space-x-2">
            <Button><ViewGridIcon class="w-4" /> Library</Button>
            <Button><PuzzleIcon class="w-4" /> Extensions</Button>
            <Button><vue-feather type="globe" class="w-4"></vue-feather> Browse</Button>
        </div>

        <div class="flex-1 flex items-center space-x-2">
            <BrowserSwitch />
            <Button><vue-feather type="sliders" class="w-4"></vue-feather></Button>
        </div>

        <div class="flex-1 flex items-center space-x-2">
            <Button><vue-feather type="rotate-ccw" class="w-4"></vue-feather></Button>
            <Button><vue-feather type="rotate-cw" class="w-4"></vue-feather></Button>
            <Button><vue-feather type="save" class="w-4"></vue-feather></Button>
            <Button><vue-feather type="eye" class="w-4"></vue-feather> Preview</Button>
            <Button><vue-feather type="send" class="w-4"></vue-feather> Publish</Button>
            <Button><vue-feather type="settings" class="w-4"></vue-feather></Button>
        </div>

 </div>-->


<!--    <div>-->
<!--        <TextAlign class="mt-2" />-->
<!--        <TextColor class="mt-2" />-->
<!--        <BackgroundColor class="mt-2" />-->
<!--    </div>-->


    <div class="bg-gray-400 py-3 px-3 gap-3 align-items-center justify-center flex">
       <div>
           <BrowserSwitch />
       </div>
        <div class="flex gap-3">
            <button v-on:click="savePage()" type="button" class="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium">
                Save
            </button>
            <button v-on:click="resetPage()" type="button" class="bg-red-800 text-white px-3 py-2 rounded-md text-sm font-medium">
                Reset
            </button>
        </div>
    </div>

    <div class="w-full h-full flex justify-center items-center">
        <iframe id="js-tailwind-editor-iframe"

                :src="url"
                :style="[
                deviceName == 'Desktop' ? 'width:90%' : '',
                deviceName == 'Tablet' ? 'width:600px' : '',
                deviceName == 'Phone' ? 'width:450px' : ''
            ]"></iframe>
    </div>

<!--   <div>
       <Tags class="mt-2" />
   </div>-->

    <MessageModal />
    <SimpleModal />

</template>

<style>
#js-tailwind-editor-iframe {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>

<script>
import { ref, reactive } from 'vue'

import {LiveEdit} from "../../LiveEdit/LiveEdit.ts";

import {
    BackspaceIcon,
    FastForwardIcon,
    EyeIcon,
    PaperAirplaneIcon,
    SaveIcon,
    ViewGridIcon,
    PuzzleIcon,
    BookmarkIcon,
    CogIcon,
    AdjustmentsIcon,
    ArrowSmLeftIcon,
    ArrowSmRightIcon,

} from '@heroicons/vue/outline'

import Layout from './Layout.vue'
import Tags from './Text/Tags.vue'
import TextAlign from './Text/TextAlign.vue'
import TextColor from './Text/TextColor.vue'
import BackgroundColor from './Text/BackgroundColor.vue'
import BrowserSwitch from './Responsive/BrowserSwitch.vue'
import SimpleModal from "./SimpleModal.vue";
import MessageModal from "./MessageModal.vue";

import Button from "./Button.vue";

let deviceName = 'Phone';
let lastSelectedElement = [];

export default {
    components: {
        BackspaceIcon,
        FastForwardIcon,
        EyeIcon,
        PaperAirplaneIcon,
        SaveIcon,
        ViewGridIcon,
        PuzzleIcon,
        BookmarkIcon,
        CogIcon,
        AdjustmentsIcon,
        ArrowSmLeftIcon,
        ArrowSmRightIcon,
        Button,
        BrowserSwitch,
        Tags,
        Layout,
        TextAlign,
        TextColor,
        BackgroundColor,
        SimpleModal,
        MessageModal
    },
    methods: {
        savePage() {
            console.log('request to save page');
            let liveEditEvent = new CustomEvent('JsLiveEdit::RequestToSavePage', {});
            document.dispatchEvent(liveEditEvent);
        },
        resetPage() {
            console.log('request to reset page');
            let liveEditEvent = new CustomEvent('JsLiveEdit::RequestToResetPage', {});
            document.dispatchEvent(liveEditEvent);
        }
    },
    mounted() {

        document.addEventListener("JsLiveEdit::SwitchDevice", (event) => {
            this.deviceName = event.detail.device;
            this.$forceUpdate();
        });

        document.addEventListener("JsLiveEdit::ElementChange", (event) => {
            this.lastSelectedElement = event.detail;
            this.$forceUpdate();
        });

        const liveEdit = new LiveEdit('js-tailwind-editor-iframe');
        liveEdit.fire();

    },
    data() {
        return {
            url: '/',
            deviceName,
            lastSelectedElement,
        }
    },
}
</script>
