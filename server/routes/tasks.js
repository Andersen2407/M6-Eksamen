const express = require("express");
const router = express.Router();

const db = require("../db");

router.post("/create", (req, res) => {

    const {
        title,
        description
    } = req.body;

    db.run(`
        INSERT INTO tasks
        (title, description)
        VALUES (?, ?)
    `,
    [
        title,
        description
    ],
    (err) => {

        if (err) {

            return res.status(500).json(err);
        }

        res.json({
            message: "Task created"
        });
    });
});

router.get("/", (req, res) => {

    db.all(
        "SELECT * FROM tasks",
        [],
        (err, rows) => {

            if (err) {

                return res.status(500).json(err);
            }

            res.json(rows);
        }
    );
});

module.exports = router;