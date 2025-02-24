import userSchema from "../model/user.model.js"
import {generateTokens} from "../lib/token.js"

import bcryptjs from "bcryptjs"
import cloudinary from "../lib/cloudinary.lib.js"

const UserSignUp = async (req,res)=>{
 const {email, fullName, password} = req.body
 try {
    if (password.length < 6) {
        return res.status(400).json({message: "password must be longer than 6 letters"})
        
    }

    const users = await userSchema.findOne({email})

    if(users){
        return res.status(400).json({message: "user already exist in DB"})
    }
    if (email === "" || fullName === "" || password === "") {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    
    
    const salt = await bcryptjs.genSalt(10)
    const hasedPass = await bcryptjs.hash(password,salt)


    const NewUser = new userSchema({
    email,
    fullName,
    password: hasedPass,
    })

    if(NewUser){
     generateTokens(NewUser._id, res)
     await NewUser.save(

         res.status(201).json({_id: NewUser._id, message: "You registered successfully buddy"})
     )
    }
    else{
        return res.status(400).json({message: "invaled user"})
    }
 } catch (error) {
    console.log("error in signup controller",error)
    res.status(500)
 }
}

const UserLogin = async (req,res)=>{
    const {email, password} = req.body
    try {
        const users = await userSchema.findOne({email})

        if(!users){
            return res.status(400).json({message: "invalid credentials"})
        }
        const isPassCorrect = await bcryptjs.compare(password, users.password)
        if(!isPassCorrect){
            return res.status(400).json({message: "invalid credentials"})
        }
        generateTokens(users._id, res)
        res.status(200).json({message: "logged in successfully"})
}catch (error) {
    console.log("error in login controller",error)
    res.status(500)
}
}

const UserLoggout = (req,res) => {
    res.clearCookie("token")
    res.status(200).json({message: "logged out successfully"})
}

const UpdateUserProfile = async (req,res) => {
  try {
    const {profilePic} = req.body
    const userId = req.user._id

    const UploadRes = await cloudinary.uploader.upload(profilePic)
    const UpdateUserRecords = await userSchema.findByIdAndUpdate(userId, {profilePic: UploadRes.secure_url },{new: true})
    
    return res.status(200).json(UpdateUserRecords)
  } catch (error) {
      console.log("error in update profile controller",error)
      res.status(500)
    
  }
}

const isUserLoggedIn = (req,res) => {
    try {
        return res.json(req.user)
    } catch (error) {
        console.log("check isUserLoggedIn in contrioller")
    }
}
export { UserSignUp , UserLogin , UserLoggout, UpdateUserProfile, isUserLoggedIn }