(function () {
    var inputField = $("input");
    var countriesContainer = $(".countries-container");
    var child = 0;
    var Mycountry;

    ///////// input ///////////

    inputField.on("input", function () {
        var userInput = inputField.val();

        $.ajax({
            url: "https://flame-egg.glitch.me/",
            method: "GET",
            data: {
                q: userInput,
            },
            success: function (response) {
                Mycountry = "";

                for (var i = 0; i < response.length; i++) {
                    if (
                        response[i]
                            .toLowerCase()
                            .indexOf(userInput.toLowerCase()) === 0
                    ) {
                        Mycountry += "<p>" + response[i] + "</p>";
                    }
                }
                if (Mycountry == "" && !userInput == "") {
                    Mycountry = "no results";
                }

                countriesContainer.html(Mycountry);
            },
            error: function (err) {
                console.log("This is an error:", err);
            },
        });
    });

    ////////// input end ///////////

    ////////// mouseover ////////////

    countriesContainer.on("mouseover", "p", function (event) {
        var target = $(event.target);
        target.addClass("highlight");
    });

    //////// mouseover end ///////////

    /////// mouseout ///////////////

    countriesContainer.on("mouseout", "p", function (event) {
        var target = $(event.target);
        target.removeClass("highlight");
    });

    /////// mouseout end //////////

    ///////// mousedown //////////

    countriesContainer.on("mousedown", "p", function (event) {
        var target = $(event.target);
        var content = target.text();
        inputField.val(content);

        if (inputField.val() == content) {
            countriesContainer.html("");
        }
    });

    /////// mousedown end ///////

    ////////// keydonwn /////////////

    inputField.on("keydown", function (event) {
        var focused = countriesContainer.children();

        if (focused.length > 0) {
            if (event.keyCode === 40) {
                if (focused.last().hasClass("highlight")) {
                    return;
                } else if (!focused.hasClass("highlight")) {
                    child = 0;
                    focused.eq(0).addClass("highlight");
                } else {
                    focused.eq(child).removeClass("highlight");
                    child++;
                    focused.eq(child).addClass("highlight");
                }
            }

            if (event.keyCode === 38) {
                if (focused.eq(0).hasClass("highlight")) {
                    return;
                } else if (!focused.hasClass("highlight")) {
                    focused.last().addClass("highlight");
                    var index = focused.length - 1;
                    child = index;
                } else if (focused.hasClass("highlight")) {
                    focused.eq(child).removeClass("highlight");
                    child--;
                    focused.eq(child).addClass("highlight");
                }
            }
        }

        if (event.keyCode === 13) {
            inputField.val(focused.eq(child).text());
            child = 0;
            countriesContainer.html("");
        }
    });

    /////////// keydown end /////////////

    ////////// focus //////////////////

    inputField.on("focus", function () {
        countriesContainer.show(200);
    });

    ///////// focus end ////////////

    ///////// blur ////////////

    inputField.on("blur", function () {
        countriesContainer.hide(200);
    });

    //////// blur end ////////
})();
