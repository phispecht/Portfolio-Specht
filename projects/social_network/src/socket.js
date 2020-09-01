import * as io from "socket.io-client";
import { chatMessages, chatMessage } from "./actions";

export let socket;

export const init = (store) => {
    /* console.log("socket inside"); */
    if (!socket) {
        socket = io.connect();
        /* console.log(socket); */

        socket.on("addChatMsg", (msg) => {
            console.log(`
            Got a message in the client! I'm about to start the whole Redux process by dispatching here. My message is ${msg}
            `);
        });
        socket.on("chatMessages", (msgs) => store.dispatch(chatMessages(msgs)));

        socket.on("chatMessage", (msg) => store.dispatch(chatMessage(msg)));
    }
};
