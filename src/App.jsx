import { useState } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage'
import { AuthProvider } from './context/AuthContext'

function App() {

  return (
    <AuthProvider>
      <div>
        <LoginPage />
      </div>
    </AuthProvider>
  )
}

export default App
