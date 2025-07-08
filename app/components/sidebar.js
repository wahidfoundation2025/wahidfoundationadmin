'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, LogOut, ChevronDown, ChevronUp, Users, LayoutDashboard, FolderKanban,
  Handshake, BookOpen, Settings as SettingsIcon, Database
} from 'lucide-react';
import {
  SignedIn,
  UserButton,
  useUser,
  SignOutButton,
} from '@clerk/nextjs';

const cmsNavItems = [
  { name: 'Home', key: 'dashboard', href: '/home', icon: <LayoutDashboard size={18} /> },
  { name: 'Projects', key: 'cms', href: '/projects', icon: <FolderKanban size={18} /> },
  { name: 'Impact', key: 'cms', href: '/impact', icon: <BookOpen size={18} /> },
  { name: 'Volunteers', key: 'cms', href: '/volunteers/list', icon: <Users size={18} /> },
];

const navItems = [
  { name: 'Dashboard', key: 'dashboard', href: '/', icon: <LayoutDashboard size={18} /> },
  { name: 'CMS', key: 'cms', icon: <Database size={18} /> }, // Dropdown trigger
  { name: 'Donation', key: 'donations', href: '/donation', icon: <Handshake size={18} /> },
  { name: 'Donors', key: 'donors', href: '/donors', icon: <Users size={18} /> },
  { name: 'Settings', key: 'settings', href: '/settings', icon: <SettingsIcon size={18} /> },
];

export default function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cmsDropdown, setCmsDropdown] = useState(false);
  const [access, setAccess] = useState([]);
  const pathname = usePathname();
  const { user } = useUser();

  const getNavClass = (href) =>
    pathname === href
      ? 'bg-gray-300 text-black font-semibold'
      : 'text-white hover:bg-black font-bold';

  const isCmsActive = cmsNavItems.some(item => pathname.startsWith(item.href));

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const fetchAccess = async () => {
        try {
          const res = await fetch(`/api/users/${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`);
          if (!res.ok) throw new Error('Access fetch failed');
          const data = await res.json();
          setAccess(data.access || []);
        } catch (err) {
          console.error('Failed to load user access:', err);
        }
      };
      fetchAccess();
    }
  }, [user]);

  const show = (key) => access.includes(key);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r p-6 justify-between bg-gray-800">
        <div>
          <div className="text-xl font-bold mb-6 color-black pl-3 text-white uppercase">Wahid</div>
          <nav className="space-y-5 uppercase">
            {show('dashboard') && (
              <Link href="/">
                <div className={`flex items-center gap-2 rounded-md px-3 mt-4 py-2 cursor-pointer font-medium transition ${getNavClass('/')}`}>
                  {navItems[0].icon} {navItems[0].name}
                </div>
              </Link>
            )}

            {show('cms') && (
              <div className="mt-4">
                <button
                  onClick={() => setCmsDropdown(v => !v)}
                  className={`flex items-center gap-2 w-full rounded-md px-3 py-2 font-bold transition ${isCmsActive ? 'bg-gray-300 text-black' : 'text-white hover:bg-black'}`}
                >
                  {navItems[1].icon} CMS {cmsDropdown || isCmsActive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {(cmsDropdown || isCmsActive) && (
                  <div className="ml-6 mt-2 flex flex-col gap-1">
                    {cmsNavItems.map(item => (
                      <Link key={item.name} href={item.href}>
                        <div className={`flex items-center gap-2 rounded px-2 py-1 cursor-pointer transition ${pathname.startsWith(item.href) ? 'bg-gray-300 text-black font-semibold' : 'hover:bg-gray-200 text-white'}`}>
                          {item.icon} {item.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {show('donations') && (
              <Link href="/donation">
                <div className={`flex items-center gap-2 rounded-md px-3 mt-4 py-2 cursor-pointer font-medium transition ${getNavClass('/donation')}`}>
                  {navItems[2].icon} {navItems[2].name}
                </div>
              </Link>
            )}

            {show('donors') && (
              <Link href="/donors">
                <div className={`flex items-center gap-2 rounded-md px-3 mt-4 py-2 cursor-pointer font-medium transition ${getNavClass('/donors')}`}>
                  {navItems[3].icon} {navItems[3].name}
                </div>
              </Link>
            )}

            {show('settings') && (
              <Link href="/settings">
                <div className={`flex items-center gap-2 rounded-md px-3 mt-4 py-2 cursor-pointer font-medium transition ${getNavClass('/settings')}`}>
                  {navItems[4].icon} {navItems[4].name}
                </div>
              </Link>
            )}
          </nav>
        </div>

        <div className="mt-8">
          <SignedIn>
            <div className="flex items-center gap-3 mb-4 py-2 px-2 bg-gray-100 rounded-xl">
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

      {/* Main content */}
      <main className="flex-1 p-6 bg-white w-full">{children}</main>
    </div>
  );
}
