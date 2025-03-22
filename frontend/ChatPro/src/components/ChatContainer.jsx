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
  const { message, getMessage, selectedUser, isMessageLoading, subscribeToMessages, unsubscribeToMessages, removeMessage, stickers, getStickers} = useChatStore()
  const { AuthUser } = useAuthStore()
  const messageEndRef = useRef(null)

  const [menu, setMenu] = useState({})

  const DisplayMenu = ((messageId) => {
     
      setMenu((m) => ({...m, [messageId] : !m[messageId]}))
      }
    )
    console.log(menu)
    useEffect(() => {
      getStickers()
    },[])

    

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
  console.log(stickers)
  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      {stickers.map((sticker) => (
        <div key={sticker}> {/* Use a unique 'key' prop */}
          <img src={sticker} alt="Image" />

        </div>
      ))}
      <ChatInput />
    </div>
  )
}

export default ChatContainer