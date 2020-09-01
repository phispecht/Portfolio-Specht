(function () {
    var nextUrl;
    var remove = "false";
    var moreItems = [];
    var baseUrl = "http://spicedify.herokuapp.com/spotify";
    var userInput;
    var albumOrArtist;

    $("#submit-btn").on("click", function () {
        userInput = $("input[name=user-input]").val();
        albumOrArtist = $("select").val();
        $("#results-container").children().remove();
        remove = "true";
        spotify(baseUrl, userInput, albumOrArtist);
    });

    function spotify(url, userInput, albumOrArtist) {
        $.ajax({
            url: url,
            method: "GET",
            data: {
                query: userInput,
                type: albumOrArtist,
            },
            dataType: "json",
            success: function (data) {
                var data = data.albums || data.artists;

                var html = "";
                var searchResult = "";
                var imgUrl = "default.jpg";

                for (var i = 0; i < data.items.length; i++) {
                    if (data.items[i].images.length > 0) {
                        imgUrl = data.items[i].images[0].url;
                    }
                    searchResult += data.items[i];

                    /////// check if items need to be removed on  clicking the submit button again //////

                    if (remove == "true") {
                        moreItems = [];
                        $("#results-container").children().remove();
                        remove = "false";
                    }

                    ///////// assign to html /////////

                    html +=
                        "<div><span><a href='" +
                        data.items[i].external_urls.spotify +
                        "'>" +
                        data.items[i].name +
                        "</a>" +
                        "</span>" +
                        "<a href='" +
                        data.items[i].external_urls.spotify +
                        "'><img src='" +
                        imgUrl +
                        "'/></a></div>";
                }

                //////// check if search result exist /////////

                if (searchResult != "") {
                    searchResult =
                        "<h2>Search results for " + userInput + "</h2>";
                } else {
                    moreItems = [];
                    searchResult = "<h2>No results for " + userInput + "</h2>";
                }

                //////// push in the items ////////////

                moreItems.push(html);

                $("#results-container").html(searchResult + moreItems);

                /////////// define next /////////

                if (data.next != null) {
                    nextUrl =
                        data.next &&
                        data.next.replace(
                            "https://api.spotify.com/v1/search",
                            baseUrl
                        );
                }
                infiniteCheck();
            },
            error: function (err) {
                console.log("err", err);
            },
        });
    }

    ////////////// infinite scroll ///////////////////

    function infiniteCheck() {
        if (
            $(window).scrollTop() >=
            $(document).height() - $(window).height() - 500
        ) {
            spotify(nextUrl, userInput, albumOrArtist);
        }
        setTimeout(infiniteCheck, 500);
    }

    ////////////////////////////////////////////////// setTimeout(check, 500);
})();
