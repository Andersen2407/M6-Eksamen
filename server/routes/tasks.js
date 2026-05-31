const express = require("express");
const db = require("../db");

const {
    requireLogin,
    requireRole
} = require("../middleware/auth");

const router = express.Router();

// Hent alle tasks (kun til debug)
router.get(
    "/debug/all",
    (req, res) => {

        db.all(`
            SELECT *
            FROM tasks
        `,
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        });
    }
);


router.get(
    "/",
    requireLogin,
    (req, res) => {

        db.all(`
            SELECT tasks.*, users.name AS assigned_name
            FROM tasks
            LEFT JOIN users
            ON tasks.assigned_to = users.id
            ORDER BY created_at DESC
        `,
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        });
    }
);


// Create task
router.post(
    "/",
    requireRole(["novo_worker", "admin"]),
    (req, res) => {

        const {
            title,
            address,
            description,
            deadline,
            dot,
            destination
        } = req.body;

        db.run(`
            INSERT INTO tasks
            (
                title,
                address,
                description,
                deadline,
                dot,
                destination,
                created_by
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            title,
            address,
            description,
            deadline,
            dot ? 1 : 0,
            destination,
            req.session.user.id
        ],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            const io = req.app.get("io");
            io.emit("task_created", {
                taskId: this.lastID,
                title
            });

            res.json({
                message: "Task created",
                taskId: this.lastID
            });
        });
    }
);


// Claim task
router.put(
    "/:id/claim",
    requireRole(["warehouse_worker", "admin"]),
    (req, res) => {

        const taskId = req.params.id;

        db.run(`
            UPDATE tasks
            SET
                assigned_to = ?,
                status = 'in_progress',
                started_at = CURRENT_TIMESTAMP
            WHERE id = ?
            AND status = 'available'
        `,
        [
            req.session.user.id,
            taskId
        ],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(400).json({
                    error: "Task unavailable"
                });
            }

            const io = req.app.get("io");
            io.emit("task_claimed", {
                taskId,
                worker: req.session.user.name
            });

            res.json({
                message: "Task claimed"
            });
        });
    }
);

// Complete task
router.put(
    "/:id/complete",
    requireRole(["warehouse_worker", "admin"]),
    (req, res) => {

        const taskId = req.params.id;

        const {
            tracking_number,
            message
        } = req.body;

        db.run(`
            UPDATE tasks
            SET
                status = 'completed',
                completed_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `,
        [taskId],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            db.run(`
                INSERT INTO completion_messages
                (
                    task_id,
                    tracking_number,
                    message
                )
                VALUES (?, ?, ?)
            `,
            [
                taskId,
                tracking_number,
                message
            ]);

            const io = req.app.get("io");

            io.emit("task_completed", {
                taskId,
            });

            res.json({
                message: "Task completed"
            });
        });
    }
);

module.exports = router;