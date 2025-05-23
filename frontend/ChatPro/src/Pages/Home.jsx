import React, { useEffect } from 'react'
import { useChatStore } from '../store/chatStore.js'
import { Sidebar } from 'lucide-react'
import ChatContainer from '../components/ChatContainer.jsx'
import GloabalChatBox from '../components/GloabalChatBox.jsx'
import {UserSidebar} from '../components/SideBar.jsx'

const HomePage = () => {
  const { selectedUser} = useChatStore()

  useEffect(() => {
    const reLoader = sessionStorage.getItem("LoadPage")

    if(!reLoader){
      sessionStorage.setItem("LoadPage",true)
      window.location.reload()
    }
  })
  return (
   <div className='h-screen bg-base-200'>
    <div className='flex items-center justify-center px-2 pt-20'>
      <div className='bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]'>
        <div className='flex h-full rounded-lg overflow-hidden'>
        <div className={selectedUser ? "hidden" : ""}>
          < UserSidebar />
          </div>
          { !selectedUser ? <GloabalChatBox /> : < ChatContainer />} 
        </div>
      </div>
    </div>
   </div>
  )
}

export default HomePage