import React, { useRef } from 'react'
import { useChatStore } from '../store/chatStore.js'
import { useEffect } from 'react'
import Skeleton from '../components/Skeletons/skeletonChat.jsx'
import ChatHeader from '../components/ChatHeader.jsx'
import ChatInput from '../components/ChatInput.jsx'
import { useAuthStore } from '../store/useAuthStore.js'
import {formatMessageTime} from "../lib/utils.js"
const image = "https://th.bing.com/th/id/OIP.PaHgcBDxUWH6FmlUnmwhQwHaMx?pid=ImgDet&w=183&h=315&c=7&dpr=1.1"

const ChatContainer = () => {
  const { message, getMessage, selectedUser, isMessageLoading, subscribeToMessages, unsubscribeToMessages} = useChatStore()
  const { AuthUser } = useAuthStore()
  const messageEndRef = useRef(null)

  useEffect(() => {
    getMessage(selectedUser?._id)

    subscribeToMessages()

    return() => {
      unsubscribeToMessages()
    }
  },[selectedUser._id, getMessage, subscribeToMessages, unsubscribeToMessages])

  useEffect(() => {
    if(messageEndRef.current && message)
    {messageEndRef.current.scrollIntoView({ behavior : "smooth" })}
  },[message])

  if(isMessageLoading) {
   return ( <div className=' flex-1 flex flex-col overflow-auto'>
    < ChatHeader />
           <Skeleton />
           < ChatInput />
   </div>
   )
  }
  return (
    <div className=' flex-1 flex flex-col overflow-auto'> 
      < ChatHeader />
    <div className='flex-1 overflow-y-auto p-4 space-y-4'>
      {message.map((message) =>(
      <div
      key={message._id}
      className={`chat ${message.senderId === AuthUser._id ? "chat-end" : "chat-start"}`}
      ref={messageEndRef}
      >
        <div className='chat-image avatar'>
          <div className='size-10 rounded-full border'>
            <img 
            src={message.senderId === AuthUser._id ? AuthUser.profilePic || image : selectedUser.profilePic || image } alt="" />
          </div>
        </div>

      <div className='chat-header mb-1'>
        <time className='text-sm opacity-45 ml-1'>
          {formatMessageTime(message.createdAt)}
        </time>
      </div>
      <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
      </div>
      ))}
    </div>
    < ChatInput />
    </div>
  )
}

export default ChatContainer