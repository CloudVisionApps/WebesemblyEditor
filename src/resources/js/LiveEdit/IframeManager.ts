import {resolveComponent} from "vue";

export class IframeManager {

    public iframe;
    public document;
    public body;
    public window;

    public constructor(private iframeId) {}

    public onLoad(callback)
    {
        const app = this;
        app.iframe = document.getElementById(this.iframeId);
        app.iframe.onload = function () {

            app.document = app.iframe.contentDocument;
            app.window = app.iframe.contentWindow;
            app.body = app.document.body;

            if (callback) {
                callback();
            }
        };
    }
}
