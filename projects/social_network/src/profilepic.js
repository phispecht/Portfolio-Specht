import React from "react";

export default function ProfilePic(props) {
    let profilePicture = "";

    if (props.profilePic == undefined) {
        profilePicture = (
            <img
                src="./img/defaultPic.png"
                alt={props.first + " " + props.last}
            />
        );
    } else {
        profilePicture = (
            <img src={props.profilePic} alt={props.first + " " + props.last} />
        );
    }

    return (
        <div>
            <div onClick={props.toggleModal} className="profilePic">
                {profilePicture}
            </div>
        </div>
    );
}
