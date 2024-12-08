import { useAuthContext } from '@/contexts/stateContext'
import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Header from './header'
import i18n from '@/i18n'

function GuestLayout() {
    const {token} =useAuthContext()

    if (token) {
      return <Navigate to={'/dashboard'}></Navigate>
    }
  return (
    <div>
      {/* <Header /> */}
      
        {<Outlet />}
    </div>
  )
}

export default GuestLayout