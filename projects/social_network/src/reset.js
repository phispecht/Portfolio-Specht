import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            code: "",
            newPassword: "",
            error: false,
            message: false,
            showReset: true,
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submitReset(e) {
        e.preventDefault();

        const email = this.state.email;

        if (email != "") {
            axios
                .post("/reset/" + email)
                .then((emailData) => {
                    if (emailData.data.rows.length == 0) {
                        return this.setState({
                            error: true,
                        });
                    }

                    this.setState({
                        error: false,
                        showReset: false,
                        message: true,
                    });
                })
                .catch(function () {
                    this.setState({
                        error: true,
                    });
                });
        } else {
            this.setState({
                error: true,
            });
        }
    }

    submitCode(e) {
        e.preventDefault();

        const code = this.state.code;
        const newPassword = this.state.newPassword;
        const email = this.state.email;

        const resetObj = { code, newPassword, email };

        axios
            .post("/verify", { resetObj })
            .then((verifyData) => {
                if (verifyData.data != "error") {
                    /* console.log(verifyData); */
                    this.setState({
                        showReset: null,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch(function () {
                this.setState({
                    error: true,
                });
            });
    }

    getCurrentDisplay() {
        if (this.state.error == true) {
            var errorMessage = (
                <p className="error">Something went wrong. Please try again!</p>
            );
        }
        if (this.state.message == true) {
            var messageReset = (
                <p className="successReset">
                    Please paste in the code we sent to you via email and type
                    in your new password.
                </p>
            );
        }

        if (this.state.showReset == true) {
            return (
                <form
                    className="loginForm"
                    onSubmit={(e) => this.submitReset(e)}
                >
                    <div className="green">
                        Please enter the email adress with which you registered
                    </div>
                    <div>
                        <input
                            placeholder="Email"
                            name="email"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        {errorMessage}
                        <input
                            className="loginButton"
                            type="submit"
                            value="Submit"
                        />
                    </div>
                </form>
            );
        } else if (this.state.showReset == false) {
            return (
                <form
                    className="loginForm"
                    onSubmit={(e) => this.submitCode(e)}
                >
                    <div>
                        <input
                            value={this.state.code}
                            placeholder="Received Code"
                            name="code"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <input
                            type="password"
                            placeholder="New Password"
                            name="newPassword"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        {errorMessage}
                        {messageReset}
                        <input
                            className="loginButton"
                            type="submit"
                            value="Submit"
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>
                </form>
            );
        } else {
            return (
                <div className="successReset">
                    <p>Success! Your password has been changed.</p>
                    <Link className="loginLink" to="/login">
                        Login here.
                    </Link>
                </div>
            );
        }
    }

    render() {
        return <div>{this.getCurrentDisplay()}</div>;
    }
}
