const express = require("express");
const hb = require("express-handlebars");
const db = require("./db");
var cookieSession = require("cookie-session");
// var context = document.getElementById("canv").getContext("2d");
const app = express();

app.use(
    cookieSession({
        secret: `I'm happy babe.`,
        maxAge: 1000 * 60 * 60 * 24 * 14 //how long you want to set the cookie
    })
);

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.use(
    express.urlencoded({
        extended: false
    })
);

app.get("/petition", (req, res) => {
    // console.log("************* / Petition ********");
    // // lets look at req. session.
    // console.log("req.session ", req.session);
    // //lets take a look at sassafras
    // console.log("req.session.sassafras: ", req.session.sassafras);
    // //lets take a look at something we know is not there
    // console.log("req.session.curry: ", req.session.curry);
    // console.log("************* /Petition ********");
    res.render("petition");
});

app.post("/petition", (req, res) => {
    db.addSignature(req.body.firstname, req.body.lastname, req.body.signature)
        .then(id => {
            console.log(id.rows);
            res.redirect("/thanks");
        })
        .catch(err => {
            console.log("ERROR :", err);
            res.send(`<p>Please try again, babe!</p>`);
        });
});

app.get("/thanks", (req, res) => {
    res.render("thanks");
});

app.listen(8080, () => {
    console.log("my server is running");
});

//////////
// app.get("/petition", (req, res) => {
//     console.log("************* / ROUTE ********");
//     // req. session starts off life as an empty object
//     console.log("req.session when it starts", req.session);
//     //lets add something to session.
//     req.session.sassafras = "<3";
//     console.log("req.sesseion after adding", req.session);
//     console.log("************* / ROUTE ********");
//     res.render("petition");
// });

// console.log("************* / ROUTE ********");
// // req. session starts off life as an empty object
// console.log("req.session when it starts", req.session);
// //lets add something to session.
// //
// // req.session.Signatureid = signature from data base
//
// console.log("req.sesseion after adding", req.session);
// console.log("************* / ROUTE ********");
