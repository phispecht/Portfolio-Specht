import React from "react";
import axios from "./axios";
import FriendButton from "./friendButton";
import FriendsOfFriends from "./friendsOfFriends";
import { BrowserRouter, Route, Link } from "react-router-dom";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            profilePic: "",
            bio: "",
        };
    }

    componentDidMount() {
        axios
            .get("/otherProfile/" + this.props.match.params.id)
            .then((otherProfile) => {
                this.setState({
                    first: otherProfile.data.rows[0].first,
                    last: otherProfile.data.rows[0].last,
                    profilePic: otherProfile.data.rows[0].imageurl,
                    bio: otherProfile.data.rows[0].bio,
                    id: otherProfile.data.rows[0].id,
                });
            })
            .catch(function () {
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        let text = "";

        if (this.state.bio == undefined || this.state.bio == null) {
            text = "> No biographie added";
        }

        let profilePicture = "";

        if (this.state.profilePic == undefined) {
            profilePicture = (
                <img
                    src="/img/defaultPic.png"
                    alt={this.state.first + " " + this.state.last}
                />
            );
        } else {
            profilePicture = (
                <img
                    src={this.state.profilePic}
                    alt={this.state.first + " " + this.state.last}
                />
            );
        }

        return (
            <div className="profile-edit">
                <span className="profile-edit-part">
                    <span className="profileName">
                        {this.state.first} {this.state.last}
                    </span>
                    <div style={{ marginTop: "5px" }} className="profileImage">
                        {profilePicture}
                    </div>
                </span>
                <span className="profile-edit-part bio-text">
                    {text}
                    {this.state.bio}
                    <BrowserRouter>
                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <FriendButton id={props.match.params.id} />
                            )}
                        />
                    </BrowserRouter>
                </span>
                <div>
                    <BrowserRouter>
                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <FriendsOfFriends id={props.match.params.id} />
                            )}
                        />
                    </BrowserRouter>
                </div>
            </div>
        );
    }
}
