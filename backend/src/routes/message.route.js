import express from "express"

import { CheckAuth } from "../middleware/CheckAuth.middleware.js"
import { getUserForSideBar , getMessages, sendMessage } from "../controller/messageHandeller.controller.js"

const messageRouter = express.Router()

messageRouter.get("/users",CheckAuth, getUserForSideBar)
messageRouter.get("/:id",CheckAuth, getMessages )
messageRouter.post("/send/:id",CheckAuth, sendMessage )

export default messageRouter