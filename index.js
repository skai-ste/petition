const express = require("express");
const app = express();
const hb = require("express-handlebars");
const db = require("./db");

// var context = document.getElementById("canv").getContext("2d");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.use(
    express.urlencoded({
        extended: false
    })
);

app.get("/petition", (req, res) => {
    res.render("petition");
});

app.post("/petition", (req, res) => {
    db.addSignature(req.body.firstname, req.body.lastname, req.body.signature)
        .then(id => {
            console.log(id.rows);
            res.send(
                `<p>Your name: ${req.body.firstname} , your last name: ${
                    req.body.lastname
                } and your ${req.body.signature}</p>`
            );
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
