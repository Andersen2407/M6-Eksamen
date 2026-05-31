const express = require("express");
const db = require("../db");

const {
    requireRole
} = require("../middleware/auth");

const router = express.Router();

// Workload per worker
router.get(
    "/workload",
    requireRole(["admin"]),
    (req, res) => {

        db.all(`
            SELECT
                users.id,
                users.name,
                COUNT(tasks.id) AS active_tasks
            FROM users
            LEFT JOIN tasks
            ON users.id = tasks.assigned_to
            AND tasks.status = 'in_progress'
            WHERE users.role = 'warehouse_worker'
            GROUP BY users.id
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

// Reassign task
router.put(
    "/tasks/:id/reassign",
    requireRole(["admin"]),
    (req, res) => {

        const taskId = req.params.id;

        const {
            assigned_to
        } = req.body;

        db.run(`
            UPDATE tasks
            SET assigned_to = ?
            WHERE id = ?
        `,
        [
            assigned_to,
            taskId
        ],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            const io = req.app.get("io");

            io.emit("task_reassigned", {
                taskId,
                assigned_to
            });

            res.json({
                message: "Task reassigned"
            });
        });
    }
);

module.exports = router;