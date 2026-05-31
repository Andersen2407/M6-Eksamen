const db = require("./db");

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT,
            email TEXT,
            password TEXT,
            role TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            title TEXT,
            description TEXT,
            deadline TEXT,

            status TEXT DEFAULT 'available',

            assigned_to INTEGER,

            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("Tables created");
});

db.close();