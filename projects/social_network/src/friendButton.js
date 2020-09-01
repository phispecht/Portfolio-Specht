import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton({ id }) {
    const [buttonText, setButtonText] = useState("");
    useEffect(() => {
        (async () => {
            const friendShip = await axios.get(`/friendship/${id}`);
            if (friendShip.data.rows.length == 0) {
                setButtonText("Send Friend Request");
            } else if (friendShip.data.rows[0].accepted == true) {
                setButtonText("End Friendship");
            } else if (
                friendShip.data.rows[0].accepted == false &&
                friendShip.data.rows[0].receiver_id == id
            ) {
                setButtonText("Accept Friend Request");
            } else {
                setButtonText("Cancel Friend Request");
            }
        })();
    }, [buttonText]);

    const friendShipButtonClick = () => {
        if (buttonText == "Send Friend Request") {
            axios
                .post(`/make-friend-request/${id}`)
                .then(function (friendShip) {
                    console.log(friendShip);
                    setButtonText("Cancel Friend Request");
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else if (buttonText == "Cancel Friend Request") {
            axios
                .post(`/cancel-friend-request/${id}`)
                .then(function (friendShip) {
                    console.log(friendShip);
                    setButtonText("Send Friend Request");
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else if (buttonText == "Accept Friend Request") {
            axios
                .post(`/accept-friend-request/${id}`)
                .then(function (friendShip) {
                    console.log(friendShip);
                    setButtonText("End Friendship");
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            axios
                .post(`/cancel-friend-request/${id}`)
                .then(function (friendShip) {
                    console.log(friendShip);
                    setButtonText("Send Friend Request");
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    return (
        <div>
            <button className="friendButton" onClick={friendShipButtonClick}>
                {buttonText}
            </button>
        </div>
    );
}
