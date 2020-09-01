import React from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";

import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import BioEditor from "./bioeditor";
import OtherProfile from "./otherProfile";
import FindPeople from "./FindPeople";
import Friends from "./friends";
import Chat from "./chat";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
            first: "",
            last: "",
            profilePic: "",
            bio: "",
            id: "",
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.setImage = this.setImage.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    componentDidMount() {
        axios
            .get("/user")
            .then((user) => {
                this.setState({
                    first: user.data.rows[0].first,
                    last: user.data.rows[0].last,
                    profilePic: user.data.rows[0].imageurl,
                    bio: user.data.rows[0].bio,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    toggleModal() {
        this.setState({
            uploaderIsVisible: true,
        });
    }

    close(check) {
        this.setState({
            uploaderIsVisible: check,
        });
    }

    setImage(newProfilePic) {
        this.setState({
            profilePic: newProfilePic,
            uploaderIsVisible: false,
        });
    }

    setBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    render() {
        return (
            <div className="profile">
                <h1 className="h1-app">Face in Tech</h1>
                <div className="profile-part">
                    <div className="profile-child-first">
                        <img className="logo" src="/img/tech-logo.png" />
                    </div>
                </div>

                <div className="profile-part profile-container">
                    <div className="profile-child">
                        <span className="toggle" onClick={this.toggleModal}>
                            <ProfilePic
                                first={this.state.first}
                                last={this.state.last}
                                profilePic={this.state.profilePic}
                                toggleModal={this.toggleModal}
                            />
                            <span className="profile-text">
                                &gt; Upload profile picture
                            </span>
                        </span>
                    </div>
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            close={() => this.close()}
                            setImage={this.setImage}
                        />
                    )}
                </div>
                <BrowserRouter>
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    profilePic={
                                        <ProfilePic
                                            id={this.state.id}
                                            first={this.state.first}
                                            last={this.state.last}
                                            profilePic={this.state.profilePic}
                                            onClick={this.showUploader}
                                        />
                                    }
                                    bioEditor={
                                        <BioEditor
                                            bio={this.state.bio}
                                            setBio={this.setBio}
                                        />
                                    }
                                />
                            )}
                        />
                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />

                        <Route path="/users" render={() => <FindPeople />} />
                        <Link to="/users">
                            <button className="searchOthersLink">
                                <i className="fas fa-search"></i>
                                Search profiles
                            </button>
                        </Link>

                        <Link to="/">
                            <button className="homeLink">
                                <i className="fas fa-house-user"></i>
                                My profile
                            </button>
                        </Link>

                        <Route path="/friends" render={() => <Friends />} />
                        <Link to="/friends">
                            <button className="friendsLink">
                                <i className="fas fa-user-friends"></i>
                                My friends
                            </button>
                        </Link>
                        <Route path="/chat" render={() => <Chat />} />
                        <Link to="/chat">
                            <button className="chatBox">
                                <span className="rotate">
                                    <i className="far fa-comments"></i>Chat
                                </span>
                            </button>
                        </Link>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
