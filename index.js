const express = require('express');
const socket = require('socket.io');

const app = express();

const PORT = 3000;

app.use(express.static("public"));

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const io = socket(server);
io.on("connection", () => {
    console.log("Socket connection made");
});