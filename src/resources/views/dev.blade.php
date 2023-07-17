{{--

<link rel="stylesheet" href="http://127.0.0.1:8000/themes/hotel_roberto/assets/style-68b7bf4e.css">

<link rel="stylesheet" href="http://127.0.0.1:8000/webesembly-editor/webesembly-elements.css" type="text/css" media="all">
--}}


<div>

{{--        <section webesembly:section="modules-with-grid">--}}
{{--            <div webesembly:flex-grid="true" style="background:#0000003b">--}}
{{--                <div  webesembly:flex-grid-element="11 / 18 / 3 / 10" style="backround:rgba(115,215,92,0.34);z-index:1;grid-area: 6 / 18 / 3 / 10">--}}
{{--                    <div webesembly:flex-grid-element-relative="true" style="z-index: 5; position: relative; height: 100%; pointer-events: auto;">--}}
{{--                        <div webesembly:flex-grid-element-absolute="true" style="height: 100%; width: 100%; position: absolute; left: 0px; top: 0px;">--}}
{{--                            <div webesembly:flex-grid-element-content="true" style="height: 100%; width: 100%; display: flex; justify-content: center;">--}}

{{--                                <div webesembly:id="u3Y0c2AIY4oiRDpTaKAI" webesembly:module="logo">--}}
{{--                                    <a href="#">--}}
{{--                                        <img src="http://127.0.0.1:8000/themes/hotel_roberto/img/core-img/logo.png" alt="">--}}
{{--                                    </a>--}}
{{--                                </div>--}}
{{--                            </div>--}}
{{--                        </div>--}}
{{--                    </div>--}}
{{--                </div>--}}
{{--            </div>--}}

{{--        </section>--}}


    <div id="container">
        <div id="draggableElement">Drag me!</div>
    </div>

</div>

<style>
    #container {
        width: 400px;
        height: 400px;
        background: #d0d0d0;
        position: relative;
    }

    #draggableElement {
        width: 100px;
        height: 100px;
        background-color: red;
        color: white;
        text-align: center;
        line-height: 100px;
        position: absolute;
        top: 0;
        left: 0;
        cursor: move;
    }
</style>

<script>
window.onload = function() {

    var draggableElement = document.getElementById('draggableElement');
    var container = document.getElementById('container');
    var isDragging = false;
    var containerRect;
    var draggableRect;
    var offset = { x: 0, y: 0 };

    draggableElement.addEventListener('mousedown', function(event) {
        isDragging = true;

        containerRect = container.getBoundingClientRect();
        draggableRect = draggableElement.getBoundingClientRect();

        offset.x = event.clientX - draggableRect.left;
        offset.y = event.clientY - draggableRect.top;
    });

    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            var x = event.clientX - containerRect.left - offset.x;
            var y = event.clientY - containerRect.top - offset.y;

            x = Math.max(0, Math.min(x, containerRect.width - draggableRect.width));
            y = Math.max(0, Math.min(y, containerRect.height - draggableRect.height));

            draggableElement.style.left = x + 'px';
            draggableElement.style.top = y + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });


}
</script>
