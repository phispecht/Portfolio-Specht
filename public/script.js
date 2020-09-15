$(document).ready(function () {
    $(".description-menu").on("click", function () {
        if ($("#nav").hasClass("show")) {
            $("#nav").removeClass("show");
        } else {
            $("#nav").addClass("show");
        }
    });
});
