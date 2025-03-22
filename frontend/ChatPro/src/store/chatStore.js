import { create } from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios.js"
import { useAuthStore} from "./useAuthStore.js"
export const useChatStore = create((set, get) => ({
 message : [],
    users : [],
    stickers : [],
    selectedUser : null,
    isUserLoading : false,
    isMessageLoading : false,
    isMessageRecieved : false,

    getUser : async () => {
        set({ isUserLoading : true})
        try {
            const res = await axiosInstance.get("/message/users")
            set({ users : res.data})
        } catch (error) {
            toast.error("Failed to fetch users")
            
        } finally{
            set({ isUserLoading : false})
        }
    },
    getMessage : async (userId) =>{
      set({ isMessageLoading : true})
      try {
          const res = await axiosInstance.get(`message/${userId}`)
          set({ message : res.data})
      } catch (error) {
          toast.error("Failed to fetch messages")
      } finally {
          set({ isMessageLoading : false})
      }
      },
    sendMessage : async (messagedata) => {
        try {
            const { selectedUser, message } = get()
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messagedata)
            set({ message : [...message, res.data]})
        } catch (error) {
            toast.error("Failed to send message")
            console.log(error)
        }
    },
    subscribeToMessages : () => {
        const {selectedUser} = get()
        if(!selectedUser) return

        const socket = useAuthStore.getState().socket

        socket.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return
            set({message: [...get().message, newMessage]})
        } )
    },
    unsubscribeToMessages : () => { 
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    },
    removeMessage : async (messageid) => {
       const { message } = get()
       const res = await axiosInstance.delete(`/message/msg/${messageid}`)
       const updatedMessages = message.filter((msg) => msg._id !== messageid);
      set({ message: updatedMessages });
           
    },
    getStickers : async () => {
        try {
            const res = await axiosInstance.get("/auth/stickers")
            set({ stickers : res.data})
        } catch (error) {
            toast.error("Failed to fetch stickers")
            
        }
    },

        setSelectedUser : async (user) => set({ selectedUser : user})
}))