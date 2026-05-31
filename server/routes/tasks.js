const express = require("express");

const db = require("../db");

module.exports = (io) => {

    const router = express.Router();

    router.get("/", (req, res) => {

        db.all(
            "SELECT * FROM tasks",
            [],
            (err, rows) => {

                res.json(rows);
            }
        );
    });

    router.post("/create", (req, res) => {

        const {
            title,
            description,
            deadline
        } = req.body;

        db.run(`
            INSERT INTO tasks
            (
                title,
                description,
                deadline
            )
            VALUES (?, ?, ?)
        `,
        [
            title,
            description,
            deadline
        ],
        function(err) {

            io.emit("taskUpdated");

            res.json({
                id: this.lastID
            });
        });
    });

    router.post("/:id/claim", (req, res) => {

        db.run(`
            UPDATE tasks
            SET status = 'in_progress'
            WHERE id = ?
        `,
        [req.params.id],
        () => {

            io.emit("taskUpdated");

            res.json({
                message: "Task claimed"
            });
        });
    });

    router.post("/:id/complete", (req, res) => {

        db.run(`
            UPDATE tasks
            SET status = 'completed'
            WHERE id = ?
        `,
        [req.params.id],
        () => {

            io.emit("taskUpdated");

            res.json({
                message: "Task completed"
            });
        });
    });

    return router;
};