const db = require("./db");

const bcrypt = require("bcrypt");

db.serialize(() => {

    // User tabel
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )
    `);

    // Opgave tabel
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            address TEXT NOT NULL,
            description TEXT NOT NULL,
            deadline TEXT,
            dot INTEGER DEFAULT 0,
            destination TEXT,

            status TEXT DEFAULT 'available',

            created_by INTEGER,
            assigned_to INTEGER,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            started_at TEXT,
            completed_at TEXT
        )
    `);

    // Completion messages tabel
    db.run(`
        CREATE TABLE IF NOT EXISTS completion_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER,
            tracking_number TEXT,
            message TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Task history tabel
    db.run(`
        CREATE TABLE IF NOT EXISTS task_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER,
            action TEXT,
            performed_by INTEGER,
            timestamp TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("Tables created");

    // Seed users efter tables er oprettet
    seedUsers();
});

async function seedUsers() {
// Arbitraere seed data
    const users = [
        {
            name: "Helle",
            email: "helle@novonordisk.com",
            password: "admin123",
            role: "admin"
        },
        {
            name: "Jens",
            email: "jens@novonordisk.com",
            password: "worker123",
            role: "warehouse_worker"
        },
        {
            name: "Maria",
            email: "maria@novonordisk.com",
            password: "worker123",
            role: "warehouse_worker"
        },
        {
            name: "Kasper",
            email: "kasper@novonordisk.com",
            password: "worker123",
            role: "warehouse_worker"
        },
        {
            name: "Production User",
            email: "production@novonordisk.com",
            password: "novo123",
            role: "novo_worker"
        }
    ];

    try {

        for (const user of users) {

            const hashedPassword = await bcrypt.hash(
                user.password,
                10
            );

            await new Promise((resolve, reject) => {

                db.run(`
                    INSERT OR IGNORE INTO users
                    (name, email, password, role)
                    VALUES (?, ?, ?, ?)
                `,
                [
                    user.name,
                    user.email,
                    hashedPassword,
                    user.role
                ],
                (err) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }

        console.log("Seed users created");

    } catch (error) {

        console.error("Error seeding users:", error);

    } finally {

        db.close((err) => {

            if (err) {
                console.error("Error closing database:", err.message);
            } else {
                console.log("Database connection closed");
            }
        });
    }
}