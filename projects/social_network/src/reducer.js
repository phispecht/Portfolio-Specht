export default function (state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        state = Object.assign({}, state, {
            showFriends: action.showFriends,
        });
    }

    if (action.type == "UNFRIEND") {
        state = Object.assign({}, state, {
            showFriends: state.showFriends.filter(
                (element) => element.id != action.id
            ),
        });
    }

    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        state = Object.assign({}, state, {
            acceptFriendship: state.showFriends.map((element) => {
                if (element.id == action.id) {
                    element.accepted = true;
                }
            }),
        });
    }

    if (action.type == "GET_MESSAGES") {
        state = Object.assign({}, state, {
            chatMessages: action.msgs.reverse(),
        });
    }

    if (action.type == "INSERT_MESSAGE") {
        state = Object.assign({}, state, {
            chatMessages: state.chatMessages.concat(action.msg),
        });
    }

    /////// get friends of friends ///////

    if (action.type == "GET_FRIENDS_OF_FRIENDS") {
        state = Object.assign({}, state, {
            friendsOf: action.friendsOf,
        });
        console.log("reducer:", state.friendsOf);
    }

    return state;
}
