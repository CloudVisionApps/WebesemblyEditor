<template>
    <div class="relative w-60 flex flex-col px-3 space-y-3">

        <div class="bg-gray-100 py-1 rounded-md mt-5">
            <div class="flex py-0.5 px-2 space-x-2 text-sm font-bold">
                <button type="button" class="flex items-center justify-center sp-2 w-full text-gray-500">
                    <SearchIcon class="w-5" /> Navigator
                </button>
                <button type="button" class="flex items-center justify-center p-2 w-full rounded-md shadow bg-white text-blue-500">
                    <PencilIcon class="w-5" /> Elements
                </button>
            </div>
        </div>
    </div>
    <div class="relative w-60 flex flex-col p-3 space-y-3">
        <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input type="text" name="search"  class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="Search..." />
        </div>
    </div>
    <div class="relative w-60 flex flex-col p-3 space-y-3">
        <dl class="space-y-1 divide-y divide-gray-100">
            <Disclosure as="div" v-for="faq in faqs" :key="faq.question" class="pt-3" v-slot="{ open }">
                <dt>
                    <DisclosureButton class="text-left w-full flex justify-between items-start text-gray-400">
                                <span :class="[open ? 'text-blue-600' : 'text-gray-900', 'font-medium']">
                                  {{ faq.question }}
                                </span>
                        <span class="ml-6 h-7 flex items-center text-gray-300">
                                  <ChevronDownIcon :class="[open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform']" aria-hidden="true" />
                                </span>
                    </DisclosureButton>
                </dt>
                <DisclosurePanel as="dd" class="mt-2 pr-12">
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </DisclosurePanel>
            </Disclosure>
        </dl>
    </div>
</template>

<script>

const faqs = [
    {
        question: "Basic (23)",
        answer:"Basic",
    },
    {
        question: "Shopify (3)",
        answer:"Shopify",
    },
    {
        question: "Single Products (2)",
        answer:"Single Products",
    },
    {
        question: "Blog Page (3)`",
        answer:"blog page",
    },
    {
        question: "Article Page (3)",
        answer:"",
    },
    {
        question: "Extensions (3)",
        answer:"",
    },
]
</script>
