const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

app.use(express.json());
app.use(express.static("public"));

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

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

app.get("/mobile", (req, res) => {

    res.sendFile(
        path.join(__dirname, "../views/mobile.html")
    );
});

app.get("/task", (req, res) => {

    res.sendFile(
        path.join(__dirname, "../views/task.html")
    );
});

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );
});