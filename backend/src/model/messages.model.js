import { timeStamp } from "console";
import mongoose from "mongoose";
import { type } from "os";

const MessagesSchema = new mongoose.Schema({
    senderId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    reciverId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    reply : {
        type: String,
        default: null
    },
    text : {
        type: String,
    },
    image : {
        type: String,
    },
    stickers : {
        type: String,
    }
},
    { timestamps : true }
)
const Message = mongoose.model("Message", MessagesSchema )

export default Message