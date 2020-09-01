import React from "react";

export default function Profile(props) {
    return (
        <div className="profile-edit">
            <span className="profile-edit-part">
                <span className="profileName">
                    {props.first} {props.last}
                </span>
                <span className="profileImage">{props.profilePic}</span>
            </span>

            <span className="profile-edit-part">{props.bioEditor}</span>
        </div>
    );
}
