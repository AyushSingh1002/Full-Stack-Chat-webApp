import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"
import { io } from "socket.io-client"

const base_URL = import.meta.env.MODE==="development"?"http://localhost:5002": "/";

export const useAuthStore = create((set, get) => ({
AuthUser : null,
isSignedIn : false,
isLoggingIn : false,
isUpdatingProfile : false,
onlineUsers : [],
isCheckingUser : true,
socket : null,

 CheckAuth : async (req,res) => {
    try {
        const res = await axiosInstance.get("/auth/Check")
        set({AuthUser : res.data})
        get().connectsocket()
    } catch (error) {
        set({AuthUser : null})
        
    } finally {
        set({isCheckingUser : false})
    }
},
  SignUp : async (data) =>{
    set({isSignedIn : true})
    console.log(data)
    try {
     const res = await axiosInstance.post("/auth/SignUp",data)
     set({AuthUser : res.data})
     
     toast.success("Account created successfully")
     get().connectsocket()
    } catch (error) {
        toast.error("Something went wrong")
        set({isSignedIn : false})
        console.log(error)
        console.log("something went wrong in Frontend request", error)
        
    } finally {
        set({isSignedIn : false})
    }

  },

  logout : async () => {
    try {
        await axiosInstance.post("/auth/logout")
        set({AuthUser : null})
        toast.success("Logged out successfully")
        get().disconnectsocket()
    } catch (error) {
        toast.error("Something went wrong")
        console.log("something went wrong in Frontend request", error)
    }
  },

  login : async (data) => {
    set({isLoggingIn : true})
    try {
        const res = await axiosInstance.post("/auth/login",data)
        set({AuthUser : res.data})
        toast.success("Logged in successfully")
        get().connectsocket()
    } catch (error) {
        toast.error("Something went wrong")
        console.log(error)
    } finally {
        set({isLoggingIn : false})
    }
},

updateProfile : async (data) => {
    set({isUpdatingProfile : true})
    try {
        const res = await axiosInstance.put("/auth/updateProfile",data)
        set({AuthUser : res.data})
        toast.success("Profile updated successfully")
    } catch (error) {
        toast.error("Something went wrong")
        
    } finally {
        set({isUpdatingProfile : false})
    }
},
connectsocket: () => {
    const { AuthUser } = get()

    if (!AuthUser || get().socket?.connected) return

    const socket = io(base_URL, {
        query: {
            userId : AuthUser._id
        }
    })
    socket.connect()
    set({socket : socket})

    socket.on("getOnlineUsers", (userIds) => {
        set({onlineUsers : userIds})
    })
},
disconnectsocket: () => {
    if (get().socket?.connected) {
        get().socket?.disconnect()
    }
   

    const socket = io(base_URL)
    socket.disconnect()
    set({socket : null})
}
})
)