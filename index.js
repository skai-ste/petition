const express = require("express");
const app = express();
const hb = require("express-handlebars");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(
    express.urlencoded({
        extended: false
    })
);

app.get("/petition", (req, res) => {
    res.send(`<h1>petition!</h1>`);
});

app.listen(8080, () => {
    console.log("my server is running");
});
