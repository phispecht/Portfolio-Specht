const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const compression = require("compression");

const cookieSession = require("cookie-session");
const { hash, compare } = require("./src/bc");
const csurf = require("csurf");
const db = require("./db");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./src/ses");

const { s3Url } = require("./config.json");
const s3 = require("./s3.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const { json } = require("express");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(compression());
app.use(express.json());

/* app.use(
    cookieSession({
        secret: "cookie",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
); */

//////// for socket //////////

const cookieSessionMiddleware = cookieSession({
    secret: `cookie`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

/////////////////////////////

app.use(
    express.static("./src"),
    express.urlencoded({
        extended: false,
    })
);

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/registration", (req, res) => {
    var first = req.body.regObj.first;
    var last = req.body.regObj.last;
    var email = req.body.regObj.email;
    var password = req.body.regObj.password;

    hash(password)
        .then((hashedPw) => {
            db.insertRegistration(first, last, email, hashedPw).then(
                (regData) => {
                    req.session.userId = regData.rows[0].id;
                    res.json(regData);
                }
            );
        })
        .catch(function (error) {
            res.sendStatus(400);
            console.log(error);
        })
        .catch(function (error) {
            res.sendStatus(400);
            console.log(error);
        });
});

app.post("/login", (req, res) => {
    var email = req.body.regObj.email;
    var password = req.body.regObj.password;

    db.selectUserLogin(email)
        .then((logData) => {
            compare(password, logData.rows[0].password)
                .then((compared) => {
                    if (compared == true) {
                        req.session.userId = logData.rows[0].id;
                        res.json(logData);
                    } else {
                        res.json("error");
                    }
                })
                .catch(function (error) {
                    res.json("error");
                    console.log(error);
                });
        })
        .catch(function (error) {
            res.json("error");
            console.log(error);
        });
});

app.post("/reset/:email", (req, res) => {
    var email = req.params.email;
    var message =
        "Dear User, your password has been reset. Please fill in this code on 'Face in Tech' and type in your new password: ";
    var subject = "Resetting Password";

    db.selectUserLogin(email)
        .then((emailData) => {
            if (emailData.rows.length != 0) {
                const secretCode = cryptoRandomString({
                    length: 10,
                });
                db.insertResetCode(email, secretCode)
                    .then(() => {
                        var myEmail = "philippspecht1990@gmail.com";

                        ses.sendEmail(myEmail, subject, message + secretCode);
                    })
                    .catch(function (error) {
                        /* res.sendStatus(400); */
                        console.log(error);
                    });
            }
            res.json(emailData);
        })
        .catch(function (error) {
            res.sendStatus(400);
            console.log(error);
        });
});

app.post("/verify", (req, res) => {
    var code = req.body.resetObj.code;
    var newPw = req.body.resetObj.newPassword;
    var email = req.body.resetObj.email;

    db.selectCode(email)
        .then((codeData) => {
            if (codeData.rows[codeData.rows.length - 1].code == code) {
                hash(newPw)
                    .then((hashedPw) => {
                        db.updatePw(hashedPw, email)
                            .then(() => {
                                res.json(codeData);
                            })
                            .catch(function (error) {
                                res.sendStatus(400);
                                console.log(error);
                            });
                    })
                    .catch(function (error) {
                        res.sendStatus(400);
                        console.log(error);
                    });
            } else {
                res.json("error");
            }
        })
        .catch(function (error) {
            res.sendStatus(400);
            console.log(error);
        });
});

app.get("/user", (req, res) => {
    var id = req.session.userId;
    db.selectUser(id)
        .then((user) => {
            res.json(user);
        })
        .catch((error) => {
            res.sendStatus(400);
            console.log(error);
        });
});

////////// upload image ///////////////////

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    const imageUrl = `${s3Url}${filename}`;
    const id = req.session.userId;

    if (req.file) {
        db.insertImage(imageUrl, id)
            .then(function (upload) {
                res.json(upload.rows);
            })
            .catch(function () {
                res.json({
                    success: false,
                });
            });
    } else {
        res.json({
            success: false,
        });
    }
});

////////// bioEdit /////////////

app.post("/bio/:bio", function (req, res) {
    var id = req.session.userId;
    var bio = req.params.bio;

    db.insertBio(bio, id)
        .then(function (bio) {
            res.json(bio.rows);
        })
        .catch(function (error) {
            console.log(error);
            json("error");
        });
});

app.get("/getBio", function (req, res) {
    var id = req.session.userId;

    db.selectUser(id)
        .then(function (bio) {
            res.json(bio.rows);
        })
        .catch(function (error) {
            console.log(error);
        });
});

//////// otherProfile ////////////

app.get("/otherProfile/:id", function (req, res) {
    var id = req.params.id;

    db.selectUser(id)
        .then(function (otherProfile) {
            res.json(otherProfile);
        })
        .catch(function (error) {
            console.log(error);
            res.json("error");
        });
});

///////// findPeople ////////////

app.get("/findpeople", function (req, res) {
    db.findpeople()
        .then(function (people) {
            res.json(people);
        })
        .catch(function (error) {
            console.log(error);
        });
});

/////// lookFor other profiles ///////

app.get("/lookFor/:first", function (req, res) {
    var first = req.params.first;

    db.lookForProfile(first)
        .then(function (profiles) {
            res.json(profiles);
        })
        .catch(function (error) {
            console.log(error);
        });
});

///////// friendShip Button ////////

app.get("/friendship/:id", function (req, res) {
    var myId = req.session.userId;
    var otherId = req.params.id;

    db.getInitialStatus(myId, otherId)
        .then(function (friendShip) {
            res.json(friendShip);
        })
        .catch(function (error) {
            res.json(error);
            console.log(error);
        });
});

app.post("/make-friend-request/:id", function (req, res) {
    var myId = req.session.userId;
    var otherId = req.params.id;

    db.sendFriendRequest(myId, otherId)
        .then(function (friendShip) {
            res.json(friendShip);
        })
        .catch(function (error) {
            res.json(error);
            console.log(error);
        });
});

app.post("/cancel-friend-request/:id", function (req, res) {
    var myId = req.session.userId;
    var otherId = req.params.id;

    db.cancelFriendRequest(otherId, myId)
        .then(function (friendShip) {
            res.json(friendShip);
        })
        .catch(function (error) {
            res.json(error);
            console.log(error);
        });
});

app.post("/accept-friend-request/:id", function (req, res) {
    var myId = req.session.userId;
    var otherId = req.params.id;
    var accept = true;

    db.acceptFriendRequest(accept, otherId, myId)
        .then(function (friendShip) {
            res.json(friendShip);
        })
        .catch(function (error) {
            res.json(error);
            console.log(error);
        });
});

//////// all friends etc ///////

app.get("/showFriends", function (req, res) {
    var id = req.session.userId;

    db.getFriendsAndRequesters(id)
        .then(function (friends) {
            res.json(friends);
        })
        .catch(function (error) {
            console.log(error);
        });
});

///////// get friends of friends ////////

app.get("/showFriendsOf/:id", function (req, res) {
    const id = req.params.id;
    console.log("id", id);

    db.getFriendsOfFriends(id)
        .then(function (friendsOfFriends) {
            console.log("get-friends server: ", friendsOfFriends);
            res.json(friendsOfFriends);
        })
        .catch(function (error) {
            console.log(error);
        });
});

///////// all star ////////////

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(process.env.PORT || 8080, function () {
    console.log("I'm listening.");
});

io.on("connection", function (socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    db.getChatMessages()
        .then(function (getMessages) {
            io.sockets.emit("chatMessages", getMessages.rows);
        })
        .catch(function (error) {
            console.log(error);
        });

    socket.on("My amazing chat message", (newMsg) => {
        const userId = socket.request.session.userId;
        db.insertMessage(newMsg, userId)
            .then(function () {
                return db.getChatMessages(userId).then(function (userMessages) {
                    io.sockets.emit("chatMessages", userMessages.rows);
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    });
});
