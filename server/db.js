const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
    "./server/database/warehouse.db",
    (err) => {

        if (err) {
            console.error(err.message);
        } else {
            console.log(
                "Connected to SQLite database"
            );
        }
    }
);

module.exports = db;