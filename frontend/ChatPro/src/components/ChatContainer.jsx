import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/chatStore.js'
import { useEffect } from 'react'
import Skeleton from './Skeletons/skeletonChat.jsx'
import ChatHeader from './ChatHeader.jsx'
import ChatInput from './ChatInput.jsx'
import { useAuthStore } from '../store/useAuthStore.js'
import {formatMessageTime} from "../lib/utils.js"
const image = "https://th.bing.com/th/id/OIP.PaHgcBDxUWH6FmlUnmwhQwHaMx?pid=ImgDet&w=183&h=315&c=7&dpr=1.1"

const ChatContainer = () => {
  const { message, getMessage, selectedUser, isMessageLoading, subscribeToMessages, unsubscribeToMessages, removeMessage, replyTo, setReplyTo} = useChatStore()
  const { AuthUser } = useAuthStore()
  const messageEndRef = useRef(null)

  const [menu, setMenu] = useState({})

  const DisplayMenu = ((messageId) => {
     
      setMenu((m) => ({...m, [messageId] : !m[messageId]}))
      }
    )
    const handleReply = (message) => {
      setReplyTo(message)
      console.log(replyTo)
    }
 

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
   return ( <div className=' flex-1 flex flex-col overflow-auto '>
    < ChatHeader />
           <Skeleton />
           < ChatInput />
   </div>
   )
  }
  return (
    <div className=' flex-1 flex flex-col overflow-auto '> 
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
        <div className={menu[message._id] ? "" : "hidden"}>
        <ul className="menu bg-base-200 rounded-box w-56 relative">
  <li className="menu-title">Menu</li>
  <li><a onClick={()=>removeMessage(message._id)}>Delete</a></li>
  <li><a onClick={()=>handleReply(message)}>Reply</a></li>
</ul>
        </div>
      <div className='chat-header mb-1'>
        <time className='text-sm opacity-45 ml-1'>
          {formatMessageTime(message.createdAt)}
        </time>
      </div>
      <div className={`${message.stickers ? "" : "chat-bubble"} flex flex-col cursor-pointer`}
      onClick={()=>DisplayMenu(message._id)}
      >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2 h-auto w-auto"
                />
              )}
              {message.stickers && (
  <img
    src={message.stickers}
    alt="Sticker"
    className="sm:max-w-[200px] h-[120px] w-[120px] bg-transparent rounded-md m-0 p-0"
  />
)}
{message.reply && (
  <div className="flex items-center gap-4 mb-2 p-3 bg-gray-100 rounded-lg shadow">
    {message.reply.length > 40 ? (
      <img
        src={message.reply}
        alt="Reply Image"
        className="h-20 w-20 object-cover rounded-lg border border-gray-300"
      />
    ) : (
      <div className="text-sm text-gray-700 font-medium">
        <span className="text-blue-600 font-semibold">Replied on:</span> {message.reply}
      </div>
    )}
  </div>
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

//chat-bubble