const express = require("express");
const path = require("path");
const http = require("http");

const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server);

const PORT = 3000;

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks")(io);

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

server.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );
});