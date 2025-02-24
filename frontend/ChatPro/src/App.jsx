import { useEffect, useState } from 'react'
import Navbar from './Components/Navbar.jsx'
import { Routes , Route, Navigate } from 'react-router-dom'
import SignUpPG from './Pages/SignUp.jsx'
import Login from './Pages/Login.jsx'
import Profile from './Pages/Profile.jsx'
import Settings from './Pages/Settings.jsx'
import Home from './Pages/Home.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore.js'


function App() {
  const { theme } = useThemeStore()
  const { CheckAuth, AuthUser, onlineUsers } = useAuthStore()

  console.log(onlineUsers)

  useEffect(() => {
    CheckAuth()
  }, [CheckAuth])
  return (
    <div data-theme={theme}>
      <Navbar /> 
      <Toaster />
      <Routes>
        <Route path="/" element={AuthUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!AuthUser ? <SignUpPG /> : <Navigate to="/" />} />
        <Route path="/login" element={!AuthUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/profile" element={AuthUser ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  )
}

export default App
