import React, { useEffect } from "react";
import { getFriendsOfFriends } from "./actions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function FriendsOfFriends({ id }) {
    const dispatch = useDispatch();
    const friendsOf = useSelector((state) => state && state.friendsOf);
    console.log("friends.js:", friendsOf);

    useEffect(() => {
        dispatch(getFriendsOfFriends(id));
    }, []);

    return (
        <>
            <h2 className="friendsOf-h2">Friends</h2>
            {friendsOf ? (
                friendsOf.map((friendsOf, index) => {
                    return (
                        <div className="friendsOf-container" key={index}>
                            <Link to={"/user/" + friendsOf.id}>
                                <img src={friendsOf.imageurl} />
                            </Link>
                            <span className="friendsOfName">
                                {friendsOf.first}&nbsp;{friendsOf.last}
                            </span>
                        </div>
                    );
                })
            ) : (
                <span>No Friends</span>
            )}
        </>
    );
}
