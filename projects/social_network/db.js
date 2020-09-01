const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { user, pw } = require("./secrets.json");
    db = spicedPg(`postgres:${user}:${pw}@localhost:5432/socialnetwork`);
}

exports.insertRegistration = (firstVal, lastVal, emailVal, passwordVal) => {
    return db.query(
        `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
        [firstVal, lastVal, emailVal, passwordVal]
    );
};

exports.selectUserLogin = (emailVal) => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [emailVal]);
};

exports.insertResetCode = (email, code) => {
    return db.query(
        `INSERT INTO reset_codes (email, code) VALUES ($1, $2) RETURNING *`,
        [email, code]
    );
};

exports.selectCode = (email) => {
    return db.query(
        `SELECT code FROM reset_codes WHERE email = $1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '5 minutes'`,
        [email]
    );
};

exports.updatePw = (hashedPw, email) => {
    return db.query(`UPDATE users SET password=$1 WHERE email = $2`, [
        hashedPw,
        email,
    ]);
};

exports.selectUser = (id) => {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
};

exports.insertImage = (imageURL, id) => {
    return db.query(
        `UPDATE users SET imageurl = $1 WHERE id = $2 RETURNING *`,
        [imageURL, id]
    );
};

exports.insertBio = (bio, id) => {
    return db.query(`UPDATE users SET bio = $1 WHERE id = $2 RETURNING *`, [
        bio,
        id,
    ]);
};

exports.findpeople = () => {
    return db.query(`SELECT * FROM users ORDER BY id DESC LIMIT 3`);
};

exports.lookForProfile = (first) => {
    return db.query(`SELECT * FROM users WHERE first ILIKE $1;`, [first + "%"]);
};

exports.getInitialStatus = (myId, otherId) => {
    return db.query(
        `
           SELECT * FROM friendships
           WHERE (receiver_id = $1 AND sender_id = $2)
           OR (receiver_id = $2 AND sender_id = $1);
           `,
        [myId, otherId]
    );
};

exports.sendFriendRequest = (myId, otherId) => {
    return db.query(
        `
           INSERT INTO friendships (receiver_id, sender_id) VALUES ($1, $2) RETURNING *
           `,
        [myId, otherId]
    );
};

exports.cancelFriendRequest = (otherId, myId) => {
    return db.query(
        `
           DELETE FROM friendships WHERE (receiver_id = $1 AND sender_id = $2)
           OR (receiver_id = $2 AND sender_id = $1)
           `,
        [otherId, myId]
    );
};

exports.acceptFriendRequest = (accept, otherId, myId) => {
    return db.query(
        `
           UPDATE friendships SET accepted = $1 
           WHERE (receiver_id = $2 AND sender_id = $3)
           OR (receiver_id = $3 AND sender_id = $2) RETURNING *
           `,
        [accept, otherId, myId]
    );
};

exports.getFriendsAndRequesters = (id) => {
    return db.query(
        `SELECT users.id, first, last, imageurl, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND sender_id = $1 AND receiver_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`,
        [id]
    );
};

exports.getChatMessages = () => {
    return db.query(
        `SELECT users.id, first, last, imageurl, text, messages.created_at
        FROM users
        JOIN messages
        ON users.id = messages.user_id 
        ORDER BY messages.created_at DESC LIMIT 10`
    );
};

exports.insertMessage = (newMsg, userId) => {
    return db.query(
        `INSERT INTO messages (text, user_id) VALUES ($1, $2) RETURNING *`,
        [newMsg, userId]
    );
};

exports.getFriendsOfFriends = (id) => {
    return db.query(
        `SELECT users.id, first, last, imageurl, accepted
        FROM friendships
        JOIN users
        ON (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`,
        [id]
    );
};
