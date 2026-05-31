const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

// Login
router.post("/login", (req, res) => {

    const { email, password } = req.body;

    db.get(
        `SELECT * FROM users WHERE email = ?`,
        [email],
        async (err, user) => {

            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!user) {
                return res.status(401).json({
                    error: "Invalid credentials"
                });
            }

            const match = await bcrypt.compare(
                password,
                user.password
            );

            if (!match) {
                return res.status(401).json({
                    error: "Invalid credentials"
                });
            }

            req.session.user = {
                id: user.id,
                name: user.name,
                role: user.role
            };

            res.json({
                message: "Login successful",
                user: req.session.user
            });
        }
    );
});

// Logout
router.post("/logout", (req, res) => {

    req.session.destroy(() => {
        res.json({
            message: "Logged out"
        });
    });
});

// Hent info om den nuværende bruger
router.get("/me", (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({
            error: "Not authenticated"
        });
    }

    res.json(req.session.user);
});

module.exports = router;