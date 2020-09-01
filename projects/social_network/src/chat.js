import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

/* console.log("socket before:", socket); */

export default function Chat() {
    const elemRef = useRef();
    const messages = useSelector((state) => state && state.chatMessages);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [messages]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("My amazing chat message", e.target.value);
            e.target.value = "";
        }
    };

    console.log("message", messages);

    return (
        <div className="chatContainer">
            <p className="chat-title">Tech Chat</p>
            <div className="chat-messages-container" ref={elemRef}>
                {messages ? (
                    messages.map((element) => {
                        return (
                            <div key={element.created_at}>
                                <div className="chatBubble">
                                    <div className="chatContent">
                                        <p className="chatName">
                                            {element.first} {element.last}
                                        </p>
                                        <div className="profilePic_Chat profilePart_inline">
                                            <img src={element.imageurl} />
                                        </div>
                                        <span className="profilePart_inline chatText">
                                            {element.text}
                                        </span>
                                        <span className="chat_created_at">
                                            {element.created_at}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <span>Nothing to show</span>
                )}
            </div>
            <textarea
                placeholder="Add your message here"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}
