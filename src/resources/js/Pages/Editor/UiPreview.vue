<template>

    <div id="js-live-edit-section-handle"
         style="display:block;width: 1040px; height: 700px; top: 20px; left: 20px;">
        <button type="button" class="js-live-edit-section-handle-action-add"
                id="js-live-edit-section-handle-action-add-top">Add section
        </button>
        <button type="button" id="js-live-edit-section-handle-action-add-block">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"></path>
            </svg>
            Add Block
        </button>
        <div class="js-live-edit-section-handle-menu">
            <button type="button" class="button-action">
                <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 20 20">
                    <path
                        d="M17.181 2.927a2.975 2.975 0 0 0-4.259-.054l-9.375 9.375a2.438 2.438 0 0 0-.656 1.194l-.877 3.95a.5.5 0 0 0 .596.597l3.927-.873a2.518 2.518 0 0 0 1.234-.678l9.358-9.358a2.975 2.975 0 0 0 .052-4.153Zm-3.552.653a1.975 1.975 0 1 1 2.793 2.793l-.671.671l-2.793-2.792l.671-.672Zm-1.378 1.38l2.793 2.792l-7.98 7.98a1.518 1.518 0 0 1-.744.409l-3.16.702l.708-3.183c.059-.267.193-.511.386-.704l7.997-7.996Z"></path>
                </svg>
                Edit Section
            </button>
            <div class="js-live-edit-section-handle-menu-group">
                <button id="js-live-edit-section-handle-action-clone" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M14 16.75H6A2.75 2.75 0 0 1 3.25 14V6A2.75 2.75 0 0 1 6 3.25h8A2.75 2.75 0 0 1 16.75 6v8A2.75 2.75 0 0 1 14 16.75Zm-8-12A1.25 1.25 0 0 0 4.75 6v8A1.25 1.25 0 0 0 6 15.25h8A1.25 1.25 0 0 0 15.25 14V6A1.25 1.25 0 0 0 14 4.75Z"/><path fill="currentColor" d="M18 20.75h-8A2.75 2.75 0 0 1 7.25 18v-2h1.5v2A1.25 1.25 0 0 0 10 19.25h8A1.25 1.25 0 0 0 19.25 18v-8A1.25 1.25 0 0 0 18 8.75h-2v-1.5h2A2.75 2.75 0 0 1 20.75 10v8A2.75 2.75 0 0 1 18 20.75Z"/></svg>
                </button>
                <button id="js-live-edit-section-handle-action-favorite" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"/></svg>
                </button>
                <button id="js-live-edit-section-handle-action-move-up" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 5v14m7-7l-7-7l-7 7"/></svg>
                </button>
                <button id="js-live-edit-section-handle-action-move-down" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19V5m-7 7l7 7l7-7"/></svg>
                </button>
            </div>
            <button class="button-action remove" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 256 256">
                    <path
                        d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16ZM96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Z"></path>
                </svg>
                Remove
            </button>
        </div>
        <button type="button" class="button-action js-live-edit-section-handle-action-add"
                id="js-live-edit-section-handle-action-add-bottom">Add section
        </button>
    </div>


    <div id="js-webesembly-element-handle-active"
         style="display:block;width: 884px; height: 68px; top: 150px; left: 78px;">
        <div id="js-webesembly-element-handle-active-name">Paragraph - Clicked Handle</div>
        <div id="js-webesembly-element-handle-active-settings"></div>
    </div>

    <div id="js-webesembly-element-handle" style="display:block;width: 884px; height: 68px; top: 270px; left: 78px;">
        <div id="js-webesembly-element-handle-name">Paragraph - Hover Handle</div>
    </div>


    <div id="js-live-edit-module-handle" style="display:block;width: 884px; height: 66px; top:540px; left: 78px;">
        <div id="js-live-edit-module-handle-name">SOCIAL-LINKS - Hover Handle</div>
    </div>

    <div id="js-live-edit-module-handle-active" style="display:block;width: 884px; height: 66px; top: 420px; left: 78px;">
        <div id="js-live-edit-module-handle-active-settings">
            <div>SOCIAL-LINKS - Clicked Handle</div>
            <div>
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <g transform="translate(24 0) scale(-1 1)">
                            <g>
                                <circle cx="12" cy="12" r="2"></circle>
                                <path
                                    d="m5.399 5.88l.25-.434a.5.5 0 0 0-.617.093l.367.34ZM3.4 9.344l-.478-.148a.5.5 0 0 0 .228.58l.25-.432Zm-.002 5.311l-.25-.433a.5.5 0 0 0-.228.581l.478-.148Zm2 3.464l-.367.34a.5.5 0 0 0 .617.093l-.25-.433Zm4.6 2.655h-.5a.5.5 0 0 0 .39.488l.11-.488Zm4.001.002l.111.488a.5.5 0 0 0 .389-.488H14ZM18.6 18.12l-.25.433a.5.5 0 0 0 .617-.093l-.367-.34Zm1.998-3.466l.478.148a.5.5 0 0 0-.228-.58l-.25.432Zm.002-5.311l.25.433a.5.5 0 0 0 .228-.581l-.478.148Zm-2-3.465l.367-.34a.5.5 0 0 0-.617-.093l.25.433ZM14 3.225h.5a.5.5 0 0 0-.389-.487L14 3.225Zm-4-.002l-.111-.488a.5.5 0 0 0-.39.488h.5Zm4 1.849h-.5h.5Zm5 8.66l-.25.433l.25-.433Zm-2 3.464l-.25.433l.25-.433ZM5 13.732l.25.433l-.25-.433Zm2-6.928l-.25.433l.25-.433ZM3.878 9.492a8.49 8.49 0 0 1 1.887-3.273l-.733-.68a9.49 9.49 0 0 0-2.11 3.658l.956.295Zm.76 6.758a8.527 8.527 0 0 1-.761-1.742l-.956.296a9.54 9.54 0 0 0 .852 1.946l.866-.5Zm1.128 1.53a8.53 8.53 0 0 1-1.127-1.53l-.866.5a9.528 9.528 0 0 0 1.259 1.71l.734-.68Zm8.123 2.51a8.49 8.49 0 0 1-3.778-.002l-.222.974a9.491 9.491 0 0 0 4.222.003l-.222-.975Zm6.233-5.782a8.49 8.49 0 0 1-1.887 3.273l.733.68a9.491 9.491 0 0 0 2.11-3.658l-.956-.295Zm-.76-6.758c.324.563.577 1.147.762 1.742l.955-.296a9.529 9.529 0 0 0-.852-1.946l-.866.5Zm-1.128-1.53a8.48 8.48 0 0 1 1.127 1.53l.866-.5a9.524 9.524 0 0 0-1.259-1.71l-.734.68Zm-8.123-2.51a8.49 8.49 0 0 1 3.778.002l.222-.974a9.49 9.49 0 0 0-4.222-.003l.222.975Zm.389 1.362v-1.85h-1v1.85h1ZM7.25 6.37l-1.601-.925l-.5.866l1.6.925l.5-.866Zm-2.5 6.928l-1.601.924l.5.866l1.6-.924l-.5-.866Zm.5-3.464l-1.6-.923l-.5.866l1.6.923l.5-.866Zm5.25 10.94v-1.847h-1v1.847h1Zm-3.75-4.012l-1.601.924l.5.866l1.6-.924l-.5-.866Zm12.101.925l-1.601-.925l-.5.866l1.601.925l.5-.866Zm-4.351 3.09v-1.85h-1v1.85h1ZM20.351 8.91l-1.601.924l.5.866l1.601-.924l-.5-.866Zm.498 5.311L19.25 13.3l-.5.866l1.6.923l.5-.866ZM14.5 5.072V3.225h-1v1.847h1Zm3.851.374l-1.601.925l.5.866l1.601-.925l-.5-.866ZM13.5 5.072c0 1.924 2.083 3.127 3.75 2.165l-.5-.866a1.5 1.5 0 0 1-2.25-1.3h-1Zm5.25 4.763c-1.667.962-1.667 3.368 0 4.33l.5-.866a1.5 1.5 0 0 1 0-2.598l-.5-.866Zm-1.5 6.928c-1.667-.962-3.75.24-3.75 2.165h1a1.5 1.5 0 0 1 2.25-1.299l.5-.866Zm-6.75 2.165c0-1.924-2.083-3.127-3.75-2.165l.5.866a1.5 1.5 0 0 1 2.25 1.3h1Zm-5.25-4.763c1.667-.962 1.667-3.368 0-4.33l-.5.866c1 .577 1 2.02 0 2.598l.5.866ZM9.5 5.072A1.5 1.5 0 0 1 7.25 6.37l-.5.866c1.667.962 3.75-.24 3.75-2.165h-1Z"></path>
                            </g>
                        </g>
                    </svg>
                </button>
            </div>
        </div>
    </div>

</template>
