import { useAuthContext } from '@/contexts/stateContext'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Header from './header'

function GuestLayout() {
    const {token} =useAuthContext()
    if (token) {
      return <Navigate to={'/home'}></Navigate>
    }
  return (
    <div>
      <Header />
      Guest Layout
        {<Outlet />}
    </div>
  )
}

export default GuestLayout