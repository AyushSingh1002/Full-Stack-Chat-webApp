import User from "../model/user.model.js"
import Message from "../model/messages.model.js"
import cloudinary from "../lib/cloudinary.lib.js"
import { getReciverSocketId, io } from "../lib/socket.js"

const getUserForSideBar = async (req, res) => {
 try {
    const UserLoggedId = req.user._id
    const filteredUsers = await User.find({_id : { $ne : UserLoggedId }}).select("-password")

    res.status(200).json(filteredUsers)
 } catch (error) {
    console.log("check something went wrong in getUserForSideBar in message controller" ,error)
 }
}

const getMessages = async (req,res) => {
try {
    const {id : othersReciverId} = req.params;
    const myId = req.user._id

    const allMessages = await Message.find(
        {
            $or :
            [
                {senderId : myId , reciverId : othersReciverId },
                { senderId : othersReciverId, reciverId : myId}
            ]
        }
    )
    res.status(200).json(allMessages)
} catch (error) {
    console.log("check something went wrong in allMessages in message controller" ,error)
}
}

const sendMessage = async (req,res) => {
    try {
        const { text , image , stickers, replyTo } = req.body
        const {id : othersReciverId} = req.params;
        const myId = req.user._id

        let imageUrl;
        if (image) {
        const uploadImage = await cloudinary.uploader.upload(image)
        imageUrl = uploadImage.secure_url
        }

        const newMessage = new Message({
            senderId : myId,
            reciverId : othersReciverId,
            text,
            image : imageUrl,
            stickers,
            reply : replyTo || null,
        })

        await newMessage.save()

        const getReciverId = getReciverSocketId(othersReciverId)
        if(getReciverId){
            io.to(getReciverId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage)

    } catch (error) {
        console.log("check something went wrong in sendMessage in message controller" ,error)
    }
}
const RemoveMsg = async (req,res) => {
    const message = req.params.id
try {
    const selectedMessage = await Message.deleteOne({_id : message})
    if(selectedMessage.deletedCount === 0){
        throw new Error("404 Message not found")
    }
   
    
    res.status(201).json({"message": "message deleted successfully", "messageId": selectedMessage})
} catch (error) {
    console.log("something wentwrong in remove message",error, message)
}
}

export { getUserForSideBar , getMessages , sendMessage, RemoveMsg }