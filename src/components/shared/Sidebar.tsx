'use client'
import { navLinks } from '@/constants'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'

const Sidebar = () => {
    const currentLink = usePathname()
  return (
    <aside className='sidebar'>
        <div className='flex size-full flex-col gap-4'>
            <Link href={'/'} className="sidebar-logo">
                <Image src='/assets/images/logo-svg.svg' alt='log' width={180} height={20}/>
            </Link>
            <nav className='sidebar-nav'>
                {/* user Signed In */}
                <SignedIn>  
                    <ul className='sidebar-nav_elements'>
                        {navLinks.slice(0,6).map((link) => {
                            // check current link user is on and active class if it matches
                            const isActive = link.route === currentLink
                            return (
                                <li key={link.route} className={`sidebar-nav_element group ${
                                    isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'
                                }`}>
                                    <Link href={link.route} className="sidebar-link">
                                        <Image
                                            src={link.icon}
                                            alt="log"
                                            width={24}
                                            height={24}
                                            className={`${isActive && 'brightness-200'}`}
                                        />
                                        {link.label}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                    <hr className='h-px bg-purple-300 border-0'/>
                        <ul className='sidebar-nav_elements'>    
                            {navLinks.slice(6).map((link) => {
                                    // check current link user is on and active class if it matches
                                    const isActive = link.route === currentLink
                                    return (
                                        <li key={link.route} className={`sidebar-nav_element group ${
                                            isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'
                                        }`}>
                                            <Link href={link.route} className="sidebar-link">
                                                <Image
                                                    src={link.icon}
                                                    alt="log"
                                                    width={24}
                                                    height={24}
                                                    className={`${isActive && 'brightness-200'}`}
                                                />
                                                {link.label}
                                            </Link>
                                        </li>
                                    )
                                })}
                            <li className='flex-center cursor-pointer gap-2 p-4'>
                                <UserButton afterSignOutUrl='/' showName/>
                            </li>
                        </ul>
                </SignedIn>

                {/* When user logout */}
                <SignedOut>
                    <Button asChild className='button bg-purple-gradient bg-cover'>
                        <Link href={'/sign-in'}>
                            Login
                        </Link>
                    </Button>
                </SignedOut>
            </nav>
        </div>
    </aside>
  )
}

export default Sidebar
