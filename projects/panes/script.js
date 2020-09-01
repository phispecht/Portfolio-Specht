$(document).ready(function () {
    var slider = $("#slider");
    var container = $("#container");
    var mousedown = false;
    var image_top = $("#top-img");
    var slider_left = slider.css("left");

    image_top.css({
        width: slider_left,
    });

    slider.on("mousedown", function () {
        mousedown = true;
    });

    container.on("mouseup", function () {
        mousedown = false;
    });

    container.on("mousemove", function (event) {
        distance = event.clientX - container.offset().left;

        if (
            mousedown == true &&
            distance <= container.width() &&
            event.clientX >= container.offset().left
        ) {
            slider.css({
                left: distance - 10, // to correct the mouse cursor, after mousedown the location of the cursor is not anymore exactly on the slider ==> mouseup won't be triggered in this case
            });

            image_top.css({
                width: distance,
            });
        }
    });
});
