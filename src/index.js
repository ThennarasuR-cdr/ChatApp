const express = require('express');
const socket = require('socket.io');
const cors = require("cors");

const app = express();

const PORT = 3000;

app.use(cors);

app.use(express.static("public"));

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const activeUsers = {};
const messages = [];

const io = socket(server, { cors: { origin: 'http://localhost:5173' } });
io.on("connection", (socket) => {
    console.log("Socket connection made");

    socket.on("connect_user", (data) => {
        socket.userId = data.userId;

        activeUsers[socket.userId] = data;
        io.emit("update_users_list", activeUsers);
    });

    socket.on("disconnect_user", (data) => {
        activeUsers[data.userId] = undefined;
        socket.userId = undefined;

        io.emit("update_users_list", activeUsers);
    });

    socket.on("send_message", (data) => {
        messages.push({
            from: socket.userId,
            content: data.message,
            time: new Date().toUTCString()
        })
        io.emit("send_messages_list", messages);
    });

    socket.on("disconnect", () => {
        console.log(socket.userId, "disconnected");
        activeUsers[socket.userId] = undefined;
        socket.userId = undefined;
        io.emit("update_users_list", activeUsers);
    })
});