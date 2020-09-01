import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [first, setFirst] = useState("");
    const [profile, setProfile] = useState([]);
    const [lookFor, setLookFor] = useState([]);

    ///////// last 3 registered ////////////

    useEffect(() => {
        (async () => {
            const people = await axios.get("/findpeople");
            setProfile(people.data.rows);
        })();
        return () => {};
    }, []);

    ///////// search for other profiles //////////

    useEffect(() => {
        let abort;
        (async () => {
            const searchProfiles = await axios.get("/lookFor/" + first);
            if (!abort) {
                setLookFor(searchProfiles.data.rows);
            }
        })();
        return () => {
            abort = true;
        };
    }, [first]);

    return (
        <div className="searchProfile-container">
            {/* getting last 3 registered users */}

            <div className="searchProfile-child latestSigners">
                <div className="latestSigners-content">
                    <h2>Our 3 most recently registered users</h2>
                    {profile.map((profile) => (
                        <div className="topProfile" key={profile.id}>
                            <span className="profileName">
                                {profile.first} {profile.last}
                            </span>
                            <span className="profileImage">
                                <Link to={"user/" + profile.id}>
                                    <img src={profile.imageurl} />
                                </Link>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* searching for other profiles */}

            <div className="serachProfile-child second-searchProfile">
                <div>
                    <h2>Want to find some other People here?</h2>
                    <form>
                        <input
                            className="searchProfile-input"
                            placeholder="look for other users"
                            onChange={(e) => setFirst(e.target.value)}
                            defaultValue={first}
                        />
                    </form>
                </div>
                <div className="searchProfile-content">
                    {lookFor &&
                        lookFor.map((lookFor) => (
                            <div
                                className="searchProfile-inline"
                                key={lookFor.id}
                            >
                                <span className="profileName">
                                    {lookFor.first} {lookFor.last}
                                </span>
                                <span className="profileImage">
                                    <Link to={"user/" + lookFor.id}>
                                        <img src={lookFor.imageurl} />
                                    </Link>
                                </span>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
