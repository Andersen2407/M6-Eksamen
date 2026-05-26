const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../views/login.html")
    );
});

app.get("/admin", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../views/admin.html")
    );
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});