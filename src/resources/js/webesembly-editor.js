import './bootstrap';
import '../css/app.css';

import { createApp } from 'vue'
import WebesemblyEditor from './Pages/Editor/Page.vue';
import WebesemblyEditorUiPreview from './Pages/Editor/UiPreview.vue';

setTimeout(() => {

    const newAppVue = createApp({
        components: {
            WebesemblyEditor,
            WebesemblyEditorUiPreview
        }
    });
    newAppVue.mount("#webesembly-editor-app");

}, 1000);
