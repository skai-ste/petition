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

app.listen(8080, () => {
    console.log("my server is running");
});
