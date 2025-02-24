import express from "express"

import {UserSignUp, UserLoggout, UserLogin, UpdateUserProfile, isUserLoggedIn} from "../controller/userHandeller.Controller.js"
import {CheckAuth} from "../middleware/CheckAuth.middleware.js"

const userRouter = express.Router()

userRouter.post("/SignUp", UserSignUp)
userRouter.post("/login", UserLogin)
userRouter.post("/logout", UserLoggout)
userRouter.put("/updateProfile",CheckAuth, UpdateUserProfile)
userRouter.get("/Check", CheckAuth, isUserLoggedIn)




export default userRouter