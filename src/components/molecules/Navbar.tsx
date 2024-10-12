"use client"

import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {FaHome, FaSearch, FaBell, FaUser} from 'react-icons/fa'
import {Button} from "@/components/ui/button"
import {AppLogoWBg} from "@/components/atoms/AppLogoWBg";
import { AiFillProduct } from "react-icons/ai";

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    icon: React.ElementType;
    isMobile: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({href, children, icon: Icon, isMobile}) => {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <Link href={href}>
            <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${isMobile ? 'flex-col items-center py-2' : ''}`}
            >
                <Icon className={`h-5 w-5 ${isMobile ? 'mb-1' : 'mr-2'}`}/>
                <span className={isMobile ? 'text-xs' : ''}>{children}</span>
            </Button>
        </Link>
    )
}

const Navbar: React.FC = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false)

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)

        return () => {
            window.removeEventListener('resize', checkScreenSize)
        }
    }, [])

    const navItems: NavItem[] = [
        {name: 'Beranda', href: '/', icon: FaHome},
        {name: 'Komoditas Saya', href: '/my-comodity', icon: AiFillProduct},
        {name: 'Profil', href: '/profile', icon: FaUser},
    ]

    return (
        <nav className={`
      ${isMobile
            ? 'fixed z-[100] bottom-0 left-0 right-0 bg-background border-t'
            : 'bg-background border-b w-full'}
    `}>
            <div className={`
        ${isMobile
                ? 'flex justify-around items-center py-2'
                : 'container mx-auto px-4 py-2 flex items-center justify-between'}
      `}>
                {!isMobile && (
                    <Link href="/" className="text-xl font-bold">
                        <AppLogoWBg/>
                    </Link>
                )}
                <div className={`
          ${isMobile
                    ? 'flex justify-around items-center w-full'
                    : 'flex items-center space-x-4'}
        `}>
                    {navItems.map((item) => (
                        <NavLink key={item.name} href={item.href} icon={item.icon} isMobile={isMobile}>
                            {item.name}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    )
}

export default Navbar