import React from "react";
import Registration from "./registration";
import Login from "./login";
import Reset from "./reset";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div className="logoBig">
            <div className="welcomeContainer">
                <h1>Face in Tech</h1>

                <div className="welcomeContainerChild">
                    <p>
                        Face in Tech is a social network for people working in
                        the tech industy helping each other to connect and work
                        on new ideas. We try to create something new people need
                        and has a big impact on the society.
                    </p>
                    <HashRouter>
                        <div>
                            <Route exact path="/" component={Registration} />
                            <Route path="/login" component={Login} />
                            <Route path="/reset" component={Reset} />
                        </div>
                    </HashRouter>
                </div>
            </div>
        </div>
    );
}
