import React, { useEffect } from "react";
import {
    acceptFriendRequest,
    receiveFriendsWannabes,
    unfriend,
} from "./actions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();
    const showFriends = useSelector(
        (state) =>
            state.showFriends &&
            state.showFriends.filter((friends) => friends.accepted == true)
    );
    const showRequesters = useSelector(
        (state) =>
            state.showFriends &&
            state.showFriends.filter((friends) => friends.accepted == false)
    );

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    if (!showFriends) {
        return null;
    }

    const allFriends = (
        <>
            {showFriends.map((showFriends, index) => (
                <div className="friendsPage-container-child" key={index}>
                    <Link to={"/user/" + showFriends.id}>
                        <img src={showFriends.imageurl} />
                    </Link>
                    <span className="friendsName">
                        {showFriends.first}&nbsp;{showFriends.last}
                    </span>
                    <button
                        className="unfriend"
                        onClick={() => dispatch(unfriend(showFriends.id))}
                    >
                        &gt; Unfriend
                    </button>
                </div>
            ))}
        </>
    );

    const allRequesters = (
        <>
            {showRequesters.map((showRequesters, index) => (
                <div className="friendsPage-container-child" key={index}>
                    <Link to={"/user/" + showRequesters.id}>
                        <img src={showRequesters.imageurl} />
                    </Link>
                    <span className="friendsName">
                        {showRequesters.first}&nbsp;{showRequesters.last}
                    </span>
                    <button
                        className="acceptFriendButton"
                        onClick={() =>
                            dispatch(acceptFriendRequest(showRequesters.id))
                        }
                    >
                        &gt; Accept Friendship
                    </button>
                </div>
            ))}
        </>
    );

    return (
        <div className="allFriends">
            <h2>Friends</h2>
            {allFriends}
            <h2>Friendship requesters</h2>
            {allRequesters}
        </div>
    );
}
