const express = require("express");
const router = (exports.router = express.Router());

router.get("/profile", (req, res) => {
    res.sendStatus(200);
});
