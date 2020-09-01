import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
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

    submitRegistration(e) {
        e.preventDefault();

        const first = this.state.first;
        const last = this.state.last;
        const email = this.state.email;
        const password = this.state.password;

        const regObj = { first, last, email, password };

        axios
            .post("/registration", { regObj })
            .then((registration) => {
                console.log(registration);
                location.replace("/");
            })
            .catch(function () {
                this.setState({
                    error: true,
                });
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
                    className="registrationForm"
                    onSubmit={(e) => this.submitRegistration(e)}
                >
                    <h2 className="registertitle">Register Now:</h2>
                    <input
                        required
                        type="text"
                        name="first"
                        placeholder="First Name"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <input
                        required
                        type="text"
                        name="last"
                        placeholder="Last Name"
                        onChange={(e) => this.handleChange(e)}
                    />
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
                        className="registerButton"
                        type="submit"
                        value="Submit"
                    />
                    <Link className="loginLink" to="/login">
                        &gt; Log in
                    </Link>
                </form>
            </div>
        );
    }
}
