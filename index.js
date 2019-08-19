const express = require("express");
const hb = require("express-handlebars");
const db = require("./utils/db");
const { hash, compare } = require("./utils/bc");
var cookieSession = require("cookie-session");
const csurf = require("csurf");
const app = express();

hash("12345");

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
    next();
});

app.use(express.static("public"));

app.use(
    express.urlencoded({
        extended: false
    })
);

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    hash(req.body.pwd)
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
            console.log("result :", result);
            res.render("petition");
        })
        .catch(err => {
            console.log("ERROR :", err);
            res.render("register", {
                error: true
            });
        });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    db.getPassword(req.body.emailaddress)
        .then(hashedPsw => {
            return compare(req.body.pwd, hashedPsw);
        })
        .then(match => {
            console.log("did my pasword match?");
            console.log(match);
            if (match) {
                res.redirect("petition");
            } else {
                res.render("login", {
                    error: true
                });
            }
        })
        .catch(err => {
            console.log("ERROR :", err);
            res.render("login", {
                error: true
            });
        });
});

app.get("/petition", (req, res) => {
    res.render("petition");
});

app.post("/petition", (req, res) => {
    db.addSignature(req.body.signature, req.session.user_id)
        .then(id => {
            console.log(id);
            req.session.signatureId = id;
            res.redirect("/thanks");
        })
        .catch(err => {
            console.log("ERROR :", err);
            res.render("petition", {
                error: true
            });
        });
});

app.get("/thanks", (req, res) => {
    if (req.session.signatureId) {
        db.getSignature(req.session.signatureId).then(result => {
            console.log("result :", result);
            res.render("thanks", {
                signature: result
            });
        });
    } else {
        res.redirect("/petition");
    }
});

app.get("/signers", (req, res) => {
    if (req.session.signatureId) {
        db.getInfo()
            .then(result => {
                let signedUsers = result.rows;
                res.render("signers", {
                    layout: "main",
                    signedUsers: signedUsers
                });
                console.log("result: ", result.rows.length);
            })
            .catch(err => {
                console.log("ERROR :", err);
            });
    } else {
        res.redirect("/petition");
    }
    // res.render("signers");
});

app.listen(8080, () => {
    console.log("my server is running");
});
