import { useAuthContext } from '@/contexts/stateContext'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Header from './header'

function GuestLayout() {
    const {token} =useAuthContext()
    if (token) {
      return <Navigate to={'/'}></Navigate>
    }
  return (
    <div>
      {/* <Header /> */}
      
        {<Outlet />}
    </div>
  )
}

export default GuestLayout