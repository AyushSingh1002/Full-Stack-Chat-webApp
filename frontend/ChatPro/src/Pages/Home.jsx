import React from 'react'
import { useChatStore } from '../store/chatStore.js'
import { Sidebar } from 'lucide-react'
import ChatContainer from '../components/ChatContainer.jsx'
import GloabalChatBox from '../components/GloabalChatBox.jsx'
import {UserSidebar} from '../components/SideBar.jsx'

const HomePage = () => {
  const { selectedUser} = useChatStore()
  return (
   <div className='h-screen bg-base-200'>
    <div className='flex items-center justify-center px-4 pt-20'>
      <div className='bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]'>
        <div className='flex h-full rounded-lg overflow-hidden'>
          < UserSidebar />
          { !selectedUser ? <GloabalChatBox /> : < ChatContainer />} 
        </div>
      </div>
    </div>
   </div>
  )
}

export default HomePage