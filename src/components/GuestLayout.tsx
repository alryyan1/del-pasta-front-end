import { useAuthContext } from '@/contexts/AppContext'
import React, { useEffect, startTransition, Suspense } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

function GuestLayout() {
    const {token} = useAuthContext()
    const navigate = useNavigate()

    useEffect(() => {
      if (token) {
        startTransition(() => {
          navigate('/dashboard')
        })
      }
    }, [token, navigate])

    if (token) {
      return null // Don't render anything while transitioning
    }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* <Header /> */}
      
        {<Outlet />}
    </Suspense>
  )
}

export default GuestLayout