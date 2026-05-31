const express = require("express");
const session = require("express-session");
const http = require("http");

const { Server } = require("socket.io");

const taskRoutes = require("./routes/tasks");
const adminRoutes = require("./routes/admin");

const db = require("./db");

const authRoutes = require("./routes/auth");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.set("io", io);

const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "warehouse-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 1000 * 60 * 60} // 1 hour
    })
);

// Static files
app.use(express.static("public"));

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/admin", adminRoutes);

const path = require("path");

// Login & views
app.get("/login", (req, res) => {

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

// Test route
app.get("/", (req, res) => {
    res.send("Warehouse System Backend Running");
});

// Socket.IO
io.on("connection", (socket) => {

    console.log("Client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// Start server
server.listen(PORT, "0.0.0.0", () => {console.log(`Server running on port ${PORT}`);});