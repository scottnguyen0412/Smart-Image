import MobileNav from '@/components/shared/MobileNav';
import Sidebar from '@/components/shared/Sidebar';
import { Toaster } from '@/components/ui/toaster';
import React from 'react'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <main className='root'>
        {/* For PC */}
        <Sidebar/>

        {/* For Mobile Navigation */}
        <MobileNav/>
        <div className='root-container'>
            <div className='wrapper'>
                {children}
            </div>
        </div>
        <Toaster/>
    </main>
  )
}

export default Layout;