import { SignUp } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className="flex-center glassmorphism-auth h-screen">
      <SignUp />
    </div>
  )
}

export default page
