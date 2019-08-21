const express = require("express");
const router = (exports.router = express.Router());

//you still have to requere database and all you needed in index.js file

app.get("/profile", (req, res) => {
    res.sendStatus(200);
});

//it's just to change index.js smaller and having more small files easer to find
// so basically you change app to router at the beggining
// so here if you have profile routes I mean get and post routes, probably you also want to have edit routes get and POST
// because they work togehter

router.get("/profile", (req, res) => {
    res.sendStatus(200);
});
