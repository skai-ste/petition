const express = require("express");
const hb = require("express-handlebars");
const db = require("./utils/db");
const { hash, compare } = require("./utils/bc");
var cookieSession = require("cookie-session");
const csurf = require("csurf");
const app = express();
const {
    hasSignature,
    hasNoSignature,
    hasUserId,
    hasNoUserId
} = require("./middleware");
// const profileRouter = require("./profile-routes");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(
    cookieSession({
        secret: `I'm happy babe.`,
        maxAge: 1000 * 60 * 60 * 24 * 14 //how long you want to set the cookie
    })
);

app.use(csurf());

app.use(function(req, res, next) {
    res.setHeader("X-Frame-Options", "DENY");
    res.locals.csrfToken = req.csrfToken();
    // console.log("Setting csrf to ", req.csrfToken());
    next();
});

app.use(express.static("public"));

app.use(
    express.urlencoded({
        extended: false
    })
);

// app.use(profileRouter);

app.get("/", (req, res) => {
    res.redirect("/register");
});

app.get("/register", hasNoUserId, (req, res) => {
    res.render("register");
});

app.post("/register", hasNoUserId, (req, res) => {
    hash(req.body.password)
        .then(hashedPsw => {
            console.log("hashedPsw: ", hashedPsw);
            return db.addUser(
                req.body.firstname,
                req.body.lastname,
                req.body.emailaddress,
                hashedPsw
            );
        })
        .then(result => {
            console.log("RESULT :", result);
            req.session.userId = result.rows[0].id;
            console.log("result.rows[0].id :", result.rows[0].id);
            res.redirect("/profile");
        })
        .catch(err => {
            console.log("ERROR :", err);
            res.render("register", {
                error: true
            });
        });
});

app.get("/login", hasNoUserId, (req, res) => {
    res.render("login");
});

app.post("/login", hasNoUserId, (req, res) => {
    db.getPassword(req.body.emailaddress)
        .then(hashedPsw => {
            console.log("hashedPsw :", hashedPsw);
            compare(req.body.password, hashedPsw.password).then(match => {
                console.log("did my pasword match?");
                console.log(match);
                if (match) {
                    req.session.userId = hashedPsw.id;
                    db.getSignature(hashedPsw.id).then(result => {
                        console.log("result from GET SIGNATURE:", result);
                        if (result) {
                            res.redirect("/thanks");
                        } else {
                            res.redirect("/petition");
                        }
                    });
                } else {
                    res.render("login", {
                        error: true
                    });
                }
            });
        })
        .catch(err => {
            console.log("ERROR :", err);
            res.render("login", {
                error: true
            });
        });
});

app.get("/profile", hasUserId, (req, res) => {
    res.render("profile");
});

app.post("/profile", hasUserId, (req, res) => {
    db.addUserProfile(
        req.body.age,
        req.body.city,
        req.body.url,
        req.session.userId
    )
        .then(result => {
            console.log("result :", result);
            res.redirect("/petition");
        })
        .catch(err => {
            console.log("ERROR :", err);
            res.render("profile", {
                error: true
            });
        });
});

app.get("/petition", hasUserId, hasNoSignature, (req, res) => {
    res.render("petition");
});

app.post("/petition", hasUserId, hasNoSignature, (req, res) => {
    db.addSignature(req.body.signature, req.session.userId)
        .then(id => {
            req.session.signatureId = id;
            res.redirect("/thanks");
        })
        .catch(err => {
            res.render("petition", {
                error: true
            });
        });
});

app.post("/delete_petition", hasUserId, hasSignature, (req, res) => {
    req.session.signatureId = null;
    db.deleteSignature(req.session.userId)
        .then(id => {
            console.log("Session:", req.session);
            res.redirect("/petition");
        })
        .catch(err => {
            console.log("ERROR :", err);
            res.render("petition", {
                error: true
            });
        });
});

app.get("/thanks", hasUserId, hasSignature, (req, res) => {
    db.getSignature(req.session.userId).then(result => {
        res.render("thanks", {
            signature: result.signature
        });
    });
});

app.get("/signers", hasUserId, hasSignature, (req, res) => {
    db.getInfo()
        .then(result => {
            let signedUsers = result.rows;
            res.render("signers", {
                layout: "main",
                signedUsers: signedUsers
            });
        })
        .catch(err => {
            console.log("ERROR :", err);
        });
});

app.get("/signers/:city", hasUserId, hasSignature, (req, res) => {
    db.getCityInfo(`${req.params.city}`)
        .then(result => {
            let signersFrom = result.rows;
            res.render("city", {
                layout: "main",
                signersFrom: signersFrom,
                city: `${req.params.city}`
            });
        })
        .catch(err => {
            console.log("ERROR :", err);
        });
});

app.get("/edit", hasUserId, hasSignature, (req, res) => {
    console.log("Session:", req.session);
    db.getUserProfileInfo(req.session.userId)
        .then(profile => {
            console.log("NEW RESULT: ", profile);
            res.render("edit", {
                layout: "main",
                profile: profile
            });
        })
        .catch(err => {
            console.log("ERROR :", err);
        });
});

app.post("/edit", hasUserId, hasSignature, (req, res) => {
    var hashedPsw = null;
    if (req.body.password) {
        hashedPsw = hash(req.body.password);
    }
    db.updateUserProfileData(req.session.userId, req.body, hashedPsw)
        .then(result => {
            res.redirect("/petition");
        })
        .catch(err => {
            console.log("ERROR :", err);
        });
});

app.post("/logout", hasUserId, (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.listen(process.env.PORT || 8080, () => {
    console.log("my server is running");
});
