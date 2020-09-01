(function () {
    var kitties = document.querySelectorAll(".kitty-container img");
    var item = 0;
    var dots = document.getElementsByClassName("dot");
    var body = document.getElementById("body");
    var timer;
    var transition;

    for (var i = 0; i < dots.length; i++) {
        dots[i].addEventListener("click", function (event) {
            for (var i = 0; i < dots.length; i++) {
                if (event.target.classList.contains("on")) {
                    return;
                } else if (transition == "transitioning") {
                    return;
                } else {
                    if (dots[i] == event.target) {
                        clearTimeout(timer);
                        moveKitties(i);
                        break;
                    }
                }
            }
        });
    }

    function moveKitties(newItem) {
        kitties[item].classList.remove("onscreen");
        dots[item].classList.remove("on");
        kitties[item].classList.add("offscreen-left");
        transition = "transitioning";

        if (typeof newItem == "undefined") {
            item++;
            if (kitties[item] == kitties[kitties.length]) {
                item = 0;
            }
        } else {
            item = newItem;
        }

        kitties[item].classList.add("onscreen");
        dots[item].classList.add("on");
    }

    timer = setTimeout(moveKitties, 5000);

    document.addEventListener("transitionend", function (event) {
        transition = "not transitioning";
        if (event.target.classList.contains("offscreen-left")) {
            event.target.classList.remove("offscreen-left");
            timer = setTimeout(moveKitties, 5000);
        }
    });

    // when a transition finishes, this function runs!
    // when the kitty moves fully offscreen, "transitionend" will happen. at this point we can safely remove its "offscreen-left" class
    /*
            We have 2 transitions that happen in this project:
                1. queue -> onscreen 
                2. onscreen -> offscreen-left 
            In "transitionend" the transition we care about is the transition to offscreen-left. In "transitionend" we DON'T care about the transition to onscreen!

            What does that mean for us?
                For us that means that in this function, we need to check which transition ended. 
                    If the transition that ended is the "offscreen-left" transition, then we need to remove the offscreen-left from the cat that has it. Removing the "offscreen-left" will make the kitty rejoin the queue 

                    If the transition that ended is the "onscreen" transition, do nothing!

            How can we tell which transition ended?
                I won't give the answer, but you need to use the "event" object :) 
        */
})();
