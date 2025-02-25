import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/UserReqHandler.js";
import ConnectDB from "./lib/Database.js";
import messageRouter from "./routes/message.route.js";
import {app, server, io} from "./lib/socket.js"
import path from "path"

dotenv.config();
const __dirname = path.resolve()

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());


// Routes
const PORT = process.env.PORT;
app.use("/api/auth", userRouter);
app.use("/api/message", messageRouter);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/ChatPro/dist")))

    app.get("*", (req,res) => {
        res.sendFile(path.join(__dirname, "../frontend/ChatPro", "dist", "index.html" ))
    })
}

// Server Start
server.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
    ConnectDB();
});
