import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'

export default function App(){
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/signup' replace />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/signin' element={<SignIn />} />
    </Routes>
  )
}
