const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {

    const {
        email,
        password
    } = req.body;

    if (
        email === "admin@novo.com" &&
        password === "1234"
    ) {

        return res.json({
            role: "admin"
        });
    }

    return res.status(401).json({
        message: "Invalid login"
    });
});

module.exports = router;