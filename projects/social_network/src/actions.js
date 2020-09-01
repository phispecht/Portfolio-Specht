import axios from "./axios";

export async function receiveFriendsWannabes() {
    const showFriends = await axios.get(`/showFriends`);
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        showFriends: showFriends.data.rows,
    };
}

/* receiveFriendsWannabes - will make a GET request to the server to retrieve the list of friends and wannabes.
The function should return an object with a type property and a friendsWannabes property whose value is the array of friends and wannabes from the server. */

export async function acceptFriendRequest(id) {
    const acceptFriendship = await axios.post(`/accept-friend-request/${id}`);
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        id: id,
    };
}

/* acceptFriendRequest - makes a POST request to the server to accept the friendship.
The function should return an object with a type property and the id of the user whose friendship was accepted. */

export async function unfriend(id) {
    const deleteFriendship = await axios.post(`/cancel-friend-request/${id}`);
    return {
        type: "UNFRIEND",
        id: id,
    };
}

/* unfriend - makes a POST request to the server to end the friendship.
It should also return an object with a type property and the id of the user whose friendship was ended. */

//////// Get messages ///////////////

export async function chatMessages(msgs) {
    return {
        type: "GET_MESSAGES",
        msgs,
    };
}

/////// Insert message ///////

export async function chatMessage(msg) {
    return {
        type: "INSERT_MESSAGE",
        msg,
    };
}

/////// get friends of friends //////

export async function getFriendsOfFriends(id) {
    const friendsOf = await axios.get(`/showFriendsOf/${id}`);
    console.log("action:", friendsOf);
    return {
        type: "GET_FRIENDS_OF_FRIENDS",
        friendsOf: friendsOf.data.rows,
    };
}
