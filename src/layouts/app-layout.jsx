import Footer from '@/components/footer'
import Header from '@/components/header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Applayout = () => {
  return (
    <div className="relative  flex flex-col">
      
      <div className="grid-background absolute inset-0 -z-10" aria-hidden="true" />
      {/* Content layer */}
      <Header />
      <main className=" min-h-screen w-full flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  ) 
}

export default Applayout
