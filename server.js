const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle chat messages

    socket.on('chat message', data => {
        io.emit('response message', data); // Broadcast the message to all connected clients
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
    // Handle user disconnection

});


const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
