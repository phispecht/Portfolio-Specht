(function () {
    $(document).ready(function () {
        var currentPlayer = "player1";
        var win = "not yet";
        var button = $("button");
        var h1 = $("h1");
        var table = $("table");
        var modalContainer = $(".modal-container");
        var score1 = 0;
        var score2 = 0;

        ////// for ready function/////////

        h1.addClass("h1-right");
        table.addClass("table-in");

        ////// eventlistener //////

        $(".column").on("click", function (e) {
            var selectedColumn = $(e.currentTarget);
            var slotsInColumn = selectedColumn.children();

            var emptySlotFound;
            if (win == "not yet") {
                for (var i = 5; i >= 0; i--) {
                    if (
                        !slotsInColumn.eq(i).hasClass("player1") &&
                        !slotsInColumn.eq(i).hasClass("player2")
                    ) {
                        slotsInColumn.eq(i).addClass(currentPlayer);
                        emptySlotFound = true;
                        break;
                    }
                }
            } else {
                return;
            }

            if (!emptySlotFound) {
                return;
            }

            if (checkForVictory(slotsInColumn)) {
                winGame();
            } else if (checkForVictory($(".row" + i))) {
                winGame();
            } else if (checkDiagonal()) {
                winGame();
            } else {
                switchPlayers();
            }
        });

        button.on("mouseover", function () {
            button.css({
                backgroundColor: "#F2EFA0",
            });
            button.html("Let's go");
        });

        button.on("mouseout", function () {
            button.css({
                backgroundColor: "#C4E6A3",
            });
            button.html("Play again?");
        });

        button.on("click", resetGame);

        /////////// win ////////////////

        function winGame() {
            var modal = $(".modal");

            win = "win";
            modal.html(currentPlayer);
            modalContainer.removeClass("modal-container-remove");
            modalContainer.show(300);
            scoreCalc();
        }

        /////////// reset game ///////////

        function resetGame() {
            var slots = $(".slot");
            var play1 = $(".play1");
            var play2 = $(".play2");

            modalContainer.addClass("modal-container-remove");

            for (var i = 0; i < slots.length; i++) {
                if (
                    slots.eq(i).hasClass("player1") ||
                    slots.eq(i).hasClass("player2")
                ) {
                    //// for switching the turn of players after reset
                    if (currentPlayer == "player1") {
                        play1.removeClass("turn");
                        currentPlayer = "player2";
                        play2.addClass("turn");
                    } else {
                        currentPlayer = "player1";
                        play2.removeClass("turn");
                        play1.addClass("turn");
                    }

                    slots.eq(i).removeClass("player1");
                    slots.eq(i).removeClass("player2");

                    win = "not yet";
                }
            }
        }

        ///////// horizontal & vertical calculation /////////

        function checkForVictory(slots) {
            var count = 0;
            for (var i = 0; i < slots.length; i++) {
                if (slots.eq(i).hasClass(currentPlayer)) {
                    count++;
                    if (count == 4) {
                        return true;
                    }
                } else {
                    count = 0;
                }
            }
        }

        //////// check diagonal /////////////

        function checkDiagonal() {
            var slots = $(".slot");
            var count = 0;

            var diagonalArrayCheck =
                // descending
                [
                    [2, 9, 16, 23],
                    [1, 8, 15, 22],
                    [8, 15, 22, 29],
                    [0, 7, 14, 21],
                    [7, 14, 21, 28],
                    [14, 21, 28, 35],
                    [6, 13, 20, 27],
                    [13, 20, 27, 34],
                    [20, 27, 34, 41],
                    [12, 19, 26, 33],
                    [19, 26, 33, 40],
                    [18, 25, 32, 39],

                    // ascending
                    [3, 8, 13, 18],
                    [4, 9, 14, 19],
                    [9, 14, 19, 24],
                    [5, 10, 15, 20],
                    [10, 15, 20, 25],
                    [15, 20, 25, 30],
                    [11, 16, 21, 26],
                    [16, 21, 26, 31],
                    [21, 26, 31, 36],
                    [17, 22, 27, 32],
                    [22, 27, 32, 37],
                    [23, 28, 33, 38],
                ];

            for (var i = 0; i < diagonalArrayCheck.length; i++) {
                for (var j = 0; j < diagonalArrayCheck[i].length; j++) {
                    if (
                        slots
                            .eq(diagonalArrayCheck[i][j])
                            .hasClass(currentPlayer)
                    ) {
                        count++;
                        if (count == 4) {
                            return true;
                        }
                    } else {
                        count = 0;
                    }
                }
            }
        }

        //////// Score calculation /////////////

        function scoreCalc() {
            var scorePlayer1 = $(".score1");
            var scorePlayer2 = $(".score2");
            if (currentPlayer == "player1") {
                score1++;
                scorePlayer1.html(score1);
            } else {
                score2++;
                scorePlayer2.html(score2);
            }
        }

        /////////// switch players ////////

        function switchPlayers() {
            var play1 = $(".play1");
            var play2 = $(".play2");

            if (currentPlayer == "player1") {
                play1.removeClass("turn");
                currentPlayer = "player2";
                play2.addClass("turn");
            } else {
                play2.removeClass("turn");
                currentPlayer = "player1";
                play1.addClass("turn");
            }
        }
    });
})();
