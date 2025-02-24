import http from "http";
import express from "express"
import { Server } from "socket.io"
const baseUrl = "http://localhost:5173"

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: baseUrl
    }
}
)

export function getReciverSocketId(userId) {
    return UserSocketMap[userId]
}


const UserSocketMap = {}



io.on("connection", (socket) => {
    console.log("new user")
    const userId = socket.handshake.query.userId
    if(userId) UserSocketMap[userId] = socket.id

    io.emit("getOnlineUsers", Object.keys(UserSocketMap))

    socket.on("disconnect", () => {
        console.log("dissconnected")
        delete UserSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(UserSocketMap))

    })
})

export { app, server, io}