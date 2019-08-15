const express = require("express");
const app = express();
const hb = require("express-handlebars");
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
    console.log("made it to the post route");
    console.log("req.body: ", req.body);
    console.log(`firstname: ${req.body.firstname}`);
    console.log(`lastname: ${req.body.lastname}`);
    console.log(`signature: ${req.body.signature}`);
    res.send(
        `<p>Your name: ${req.body.firstname} , your last name: ${
            req.body.lastname
        } and your ${req.body.signature}</p>`
    );
});

app.listen(8080, () => {
    console.log("my server is running");
});
