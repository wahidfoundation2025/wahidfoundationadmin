'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut, ChevronDown, ChevronUp, Users } from 'lucide-react'
import {
  SignedIn,
  UserButton,
  useUser,
  SignOutButton,
} from '@clerk/nextjs'

const navItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Donors', href: '/donors' },
  { name: 'Donation', href: '/donation' },
  { name: 'Impact', href: '/impact' },
]

const volunteerNavItems = [
  { name: 'Add Position', href: '/volunteers/add-position' },
  { name: 'View Positions', href: '/volunteers/positions' },
  { name: 'View Volunteers', href: '/volunteers/list' },
]

export default function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [volDropdown, setVolDropdown] = useState(false)
  const { user } = useUser()
  const pathname = usePathname()

  const getNavClass = (href) =>
    pathname === href
      ? 'bg-gray-300 text-black font-semibold'
      : 'text-white hover:bg-black font-bold'

  // Highlight dropdown if any of its items are active
  const isVolunteerActive = volunteerNavItems.some(item => pathname === item.href)

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r p-6 justify-between bg-gray-800 ">
        <div>
          <div className="text-xl font-bold mb-6 color-black pl-3 text-white uppercase">Wahid</div>
          <nav className="space-y-5 uppercase ">
            {/* Render navItems except Settings */}
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <div
                  className={`rounded-md px-3 mt-4 py-2 cursor-pointer font-medium transition ${getNavClass(
                    item.href
                  )}`}
                >
                  {item.name}
                </div>
              </Link>
            ))}
            {/* Volunteers Dropdown before Settings */}
            <div className="mt-4">
              <button
                onClick={() => setVolDropdown((v) => !v)}
                className={`flex items-center uppercase gap-2 w-full rounded-md px-3 py-2 font-bold transition ${
                  isVolunteerActive
                    ? 'bg-gray-300 text-black'
                    : 'text-white hover:bg-black'
                }`}
              >
                Volunteers
                {volDropdown || isVolunteerActive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {(volDropdown || isVolunteerActive) && (
                <div className="ml-6 mt-2 flex flex-col gap-1">
                  {volunteerNavItems.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <div
                        className={`rounded px-2 py-1 cursor-pointer transition ${
                          pathname === item.href
                            ? 'bg-gray-300 text-black font-semibold'
                            : 'hover:bg-gray-200 text-white'
                        }`}
                      >
                        {item.name}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* Settings always last */}
            <Link href="/settings">
              <div
                className={`rounded-md px-3 mt-4 py-2 cursor-pointer font-medium transition ${getNavClass(
                  '/settings'
                )}`}
              >
                Settings
              </div>
            </Link>
          </nav>
        </div>

        <div className="mt-8">
          <SignedIn>
            <div className="flex items-center gap-3 mb-4  py-2 px-2 bg-gray-100 rounded-xl">
              <UserButton afterSignOutUrl="/sign-in" />
              <div className="text-sm font-medium text-black">
                {user?.firstName} {user?.lastName}
              </div>
            </div>
            <SignOutButton>
              <button className="w-full flex items-center gap-3 text-white hover:bg-red-100 px-2 py-2 rounded-md transition font-medium bg-red-600">
                <LogOut size={18} /> Log out
              </button>
            </SignOutButton>
          </SignedIn>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar for mobile */}
      {isOpen && (
        <aside className="fixed z-40 inset-y-0 left-0 w-64 bg-black border-r shadow-md p-6 flex flex-col justify-between md:hidden">
          <div>
            <div className="text-xl font-bold mb-6 text-white mt-10 ml-3">Wahid</div>
            <nav className="space-y-2">
              {/* Render navItems except Settings */}
              {navItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <div
                    onClick={() => setIsOpen(false)}
                    className={`rounded-md px-3 py-2 cursor-pointer font-medium transition ${getNavClass(
                      item.href
                    )}`}
                  >
                    {item.name}
                  </div>
                </Link>
              ))}
              {/* Volunteers Dropdown before Settings */}
              <div className="mt-4">
                <button
                  onClick={() => setVolDropdown((v) => !v)}
                  className={`flex items-center gap-2 w-full rounded-md px-3 py-2 font-bold transition ${
                    isVolunteerActive
                      ? 'bg-gray-300 text-black'
                      : 'text-white hover:bg-gray-700'
                  }`}
                >
                  <Users size={18} />
                  Volunteers
                  {volDropdown || isVolunteerActive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {(volDropdown || isVolunteerActive) && (
                  <div className="ml-6 mt-2 flex flex-col gap-1">
                    {volunteerNavItems.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <div
                          onClick={() => setIsOpen(false)}
                          className={`rounded px-2 py-1 cursor-pointer transition ${
                            pathname === item.href
                              ? 'bg-gray-300 text-black font-semibold'
                              : 'hover:bg-gray-200 text-black'
                          }`}
                        >
                          {item.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {/* Settings always last */}
              <Link href="/settings">
                <div
                  onClick={() => setIsOpen(false)}
                  className={`rounded-md px-3 mt-4 py-2 cursor-pointer font-medium transition ${getNavClass(
                    '/settings'
                  )}`}
                >
                  Settings
                </div>
              </Link>
            </nav>
          </div>
          <div className="mt-8">
            <SignedIn>
              <div className="flex items-center gap-3 mb-4">
                <UserButton afterSignOutUrl="/sign-in" />
                <div className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </div>
              </div>
              <SignOutButton>
                <button className="flex items-center gap-2 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md transition font-medium">
                  <LogOut size={18} /> Log out
                </button>
              </SignOutButton>
            </SignedIn>
          </div>
        </aside>
      )}

      {/* Main content */}
      <main className="flex-1 p-6 bg-white w-full">{children}</main>
    </div>
  )
}