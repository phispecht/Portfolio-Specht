import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    upload(e) {
        e.preventDefault();

        var formData = new FormData();
        formData.append("file", this.file);

        axios
            .post("/upload", formData)
            .then((upload) => {
                this.props.setImage(upload.data[0].imageurl);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    select(e) {
        this.file = e.target.files[0];
    }

    close() {
        this.props.close(false);
    }

    render() {
        return (
            <div className="uploader-modal">
                <span onClick={() => this.close()} className="close">
                    X
                </span>
                Uploade Image
                <br />
                <label className="select-upload">
                    1. Select Image
                    <input
                        id="file-upload"
                        onChange={(e) => this.select(e)}
                        type="file"
                        name="file"
                        accept="image/*"
                    />
                </label>
                <button
                    className="upload-button"
                    onClick={(e) => this.upload(e)}
                >
                    2. Upload
                </button>
            </div>
        );
    }
}
