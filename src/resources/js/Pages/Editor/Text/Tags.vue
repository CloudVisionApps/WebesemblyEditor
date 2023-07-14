<template>

    <div class="block">
        <span v-if="classList" v-for="className in classList" class="inline-flex items-center py-0.5 pl-2 pr-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
          {{ className }}
          <button type="button" v-on:click="removeClass(className)" class="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white">
            <span class="sr-only">Remove small option</span>
            <svg class="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
              <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
            </svg>
          </button>
        </span>
    </div>

</template>

<script>
export default {
    methods: {
        removeClass: function (className) {
            this.currentElement.classList.remove(className);

            let liveEditEvent = new CustomEvent('click', {})
            this.currentElement.dispatchEvent(liveEditEvent);
        }
    },
    mounted() {
        document.addEventListener("JsLiveEdit::ElementChange", (event) => {
            this.currentElement = event.detail.element;
            this.classList = event.detail.classList;
            this.$forceUpdate();
        });
    },
    setup() {
        let currentElement = false;
        let classList = [];
        return {
            classList: classList,
            currentElement: currentElement,
        }
    },
}
</script>
