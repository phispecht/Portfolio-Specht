import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: "",
            editorIsVisible: false,
            error: false,
        };
    }

    handleChange(e) {
        this.setState({
            bio: e.target.value,
        });
    }

    saveBio(e) {
        e.preventDefault();

        var bio = this.state.bio;

        axios
            .post("/bio/" + bio)
            .then((bio) => {
                if (bio.data == "error") {
                    return this.setState({
                        error: true,
                    });
                }
                this.props.setBio(bio.data[0].bio);
                this.setState({
                    editorIsVisible: false,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentDidMount() {
        /////// selecting bio to put in input-field when profile loads //////

        axios
            .get("/getBio")
            .then((bio) => {
                this.setState({
                    bio: bio.data[0].bio,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    show() {
        this.setState({
            editorIsVisible: true,
        });
    }

    cancel(e) {
        e.preventDefault();
        this.setState({
            editorIsVisible: false,
        });
    }

    render() {
        if (this.state.error == true) {
            var errorMessage = (
                <p className="error">Something went wrong. Please try again!</p>
            );
        }

        let text = "";

        if (this.props.bio == undefined || this.props.bio == null) {
            text = "> Add your biographie here";
        } else {
            text = "> Edit your biographie";
        }

        if (this.state.editorIsVisible) {
            var input = (
                <form className="form-bio" onSubmit={(e) => this.saveBio(e)}>
                    <textarea
                        type="text"
                        name="biography"
                        value={this.state.bio}
                        onChange={(e) => this.handleChange(e)}
                    />
                    {errorMessage}
                    <div className="button-display-inline">
                        <button
                            name="save-button"
                            className="save-button"
                            type="submit"
                        >
                            Save
                        </button>
                        <button
                            name="cancel-button"
                            className="save-button"
                            onClick={(e) => this.cancel(e)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            );
        }

        return (
            <div className="profileTextClick">
                <p className="bio-text">{this.props.bio}</p>
                <span className="bioClick" onClick={() => this.show()}>
                    {text}
                </span>
                {input}
            </div>
        );
    }
}
