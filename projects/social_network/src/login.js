import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            error: false,
        };
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submitLogin(e) {
        e.preventDefault();

        const email = this.state.email;
        const password = this.state.password;
        const regObj = { email, password };

        axios
            .post("/login", { regObj })
            .then((login) => {
                if (login.data == "error") {
                    return this.setState({
                        error: true,
                    });
                }
                location.replace("/");
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        if (this.state.error == true) {
            var errorMessage = (
                <p className="error">Something went wrong. Please try again!</p>
            );
        }

        return (
            <div>
                <form
                    className="loginForm"
                    onSubmit={(e) => this.submitLogin(e)}
                >
                    <input
                        required
                        type="text"
                        name="email"
                        placeholder="Email"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <input
                        required
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    {errorMessage}
                    <input
                        className="loginButton"
                        type="submit"
                        value="Submit"
                    />
                    <Link className="loginLink" to="/reset">
                        &gt; Forgot your password? Click here!
                    </Link>
                </form>
            </div>
        );
    }
}
