import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

var users = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on("connection", (socket) => {
    console.log(`${socket.id} da ket noi den server`);
    socket.on("register", data => {
        if (users.indexOf(data) >= 0) {
            socket.emit("failed", "username already in use!")
        } else {
            users.push(data)
            // socket.username = data;
            socket.emit("successfull", data)
            io.emit("list useronline", users)
        }
    })

    socket.on("logout", (data) => {
        users.splice(users.indexOf(data), 1)
        socket.emit("logout complete")
        io.emit("list useronline", users)
    })

    socket.on("message", data => {
        io.emit("message", data)
    })

    socket.on("disconnect", () => {
        console.log(`${socket.id} da ngat ket noi`);
    })
})

httpServer.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})
