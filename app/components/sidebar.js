"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  ChevronUp,
  Users,
  LayoutDashboard,
  FolderKanban,
  Handshake,
  BookOpen,
  Settings as SettingsIcon,
  Database,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Logo from "../../public/logo.png";
import { TbCategory } from "react-icons/tb";
import { RiPagesLine } from "react-icons/ri";
import { VscLayoutPanelJustify } from "react-icons/vsc";

const cmsNavItems = [
  {
    name: "Home",
    key: "dashboard",
    href: "/home",
    icon: <LayoutDashboard size={18} />,
  },
  {
    name: "Projects",
    key: "cms",
    href: "/projects",
    icon: <FolderKanban size={18} />,
  },
  { name: "Impact", key: "cms", href: "/impact", icon: <BookOpen size={18} /> },
  {
    name: "Volunteers",
    key: "cms",
    href: "/volunteers/list",
    icon: <Users size={18} />,
  },
  {
    name: "Blogs",
    key: "blogs",
    href: "/blogs",
    icon: <RiPagesLine size={18} />,
  },
  {
    name: "Categories",
    key: "categories",
    href: "/categories",
    icon: <TbCategory size={18} />,
  },
  {
    name: "Footer",
    key: "footer",
    href: "/footer",
    icon: <VscLayoutPanelJustify size={18} />,
  },
];

const navItems = [
  {
    name: "Dashboard",
    key: "dashboard",
    href: "/",
    icon: <LayoutDashboard size={18} />,
  },
  { name: "CMS", key: "cms", icon: <Database size={18} /> }, // Dropdown trigger
  {
    name: "Donation",
    key: "donations",
    href: "/donation",
    icon: <Handshake size={18} />,
  },
  { name: "Donors", key: "donors", href: "/donors", icon: <Users size={18} /> },
  {
    name: "Settings",
    key: "settings",
    href: "/settings",
    icon: <SettingsIcon size={18} />,
  },
];

export default function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cmsDropdown, setCmsDropdown] = useState(false);
  const [access, setAccess] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const getNavClass = (href) =>
    pathname === href ? "text-violet-700 bg-violet-200 font-medium" : "";

  const isCmsActive = cmsNavItems.some((item) =>
    pathname.startsWith(item.href)
  );

  const fetchAccess = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${encodeURIComponent(user.email)}`);
      if (!res.ok) throw new Error("Access fetch failed");
      const data = await res.json();
      setAccess(data.access || []);
      setRole(data.role || ""); // 👈 Set role here
    } catch (err) {
      console.error("Failed to load user access:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchAccess();
    }
  }, [user]);

  const show = (key) => access.includes(key);

  return (
    <div className="flex flex-col h-screen overflow-y-auto normal-case">
      <NavBar user={user} setIsOpen={setIsOpen} isOpen={isOpen} role={role} />

      <div className="flex flex-row h-[90dvh]">
        <aside className="hidden md:flex flex-col gap-2 min-w-[250px] w-[20%] p-6 bg-white text-black">
          {loading ? (
            <div className="flex flex-col gap-2">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="w-full h-10 rounded-xl bg-gray-200"
                ></div>
              ))}
            </div>
          ) : (
            <>
              {show("dashboard") && (
                <Link href="/">
                  <div
                    className={`flex hover:bg-violet-200 items-center gap-2 rounded-lg px-3 mt-0 py-2 cursor-pointer font-medium transition normal-case ${getNavClass(
                      "/"
                    )}`}
                  >
                    {navItems[0].icon} {navItems[0].name}
                  </div>
                </Link>
              )}

              {show("cms") && (
                <>
                  <button
                    onClick={() => setCmsDropdown((v) => !v)}
                    className={`flex hover:bg-violet-200 cursor-pointer items-center justify-between gap-2 w-full rounded-lg px-3 py-2 font-medium transition normal-case ${
                      isCmsActive
                        ? "text-violet-700 bg-violet-200 font-medium"
                        : ""
                    }`}
                  >
                    <div className="flex flex-row items-center gap-2">
                      {navItems[1].icon} CMS
                    </div>
                    {cmsDropdown || isCmsActive ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>

                  {(cmsDropdown || isCmsActive) && (
                    <div className="ml-6 flex flex-col gap-0.5">
                      {cmsNavItems.map((item) => (
                        <Link key={item.name} href={item.href}>
                          <div
                            className={`flex hover:bg-violet-200 items-center gap-2 rounded-lg p-2 cursor-pointer transition normal-case ${
                              pathname.startsWith(item.href)
                                ? "text-violet-700 bg-violet-200 font-medium"
                                : ""
                            }`}
                          >
                            {item.icon} {item.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}

              {show("donations") && (
                <Link href="/donation">
                  <div
                    className={`flex hover:bg-violet-200 items-center gap-2 rounded-lg px-3 mt-0 py-2 cursor-pointer font-medium transition normal-case ${getNavClass(
                      "/donation"
                    )}`}
                  >
                    {navItems[2].icon} {navItems[2].name}
                  </div>
                </Link>
              )}

              {show("donors") && (
                <Link href="/donors">
                  <div
                    className={`flex hover:bg-violet-200 items-center gap-2 rounded-lg px-3 mt-0 py-2 cursor-pointer font-medium transition normal-case ${getNavClass(
                      "/donors"
                    )}`}
                  >
                    {navItems[3].icon} {navItems[3].name}
                  </div>
                </Link>
              )}

              {show("settings") && (
                <Link href="/settings">
                  <div
                    className={`flex hover:bg-violet-200 items-center gap-2 rounded-lg px-3 mt-0 py-2 cursor-pointer font-medium transition normal-case ${getNavClass(
                      "/settings"
                    )}`}
                  >
                    {navItems[4].icon} {navItems[4].name}
                  </div>
                </Link>
              )}
            </>
          )}
        </aside>

        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-5 left-3">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800">
            {isOpen && <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-40 p-6 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
        >
          <div className="flex justify-between items-center mb-4">
            <Image src={Logo} alt="Logo" className="h-8 w-auto" />
            <button onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col gap-2">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="w-full h-10 rounded-xl bg-gray-200"
                ></div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {show("dashboard") && (
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <div
                    className={`flex hover:bg-violet-200 items-center gap-2 rounded-lg px-3 mt-0 py-2 cursor-pointer font-medium transition ${getNavClass(
                      "/"
                    )}`}
                  >
                    {navItems[0].icon} {navItems[0].name}
                  </div>
                </Link>
              )}

              {show("cms") && (
                <>
                  <button
                    onClick={() => setCmsDropdown((v) => !v)}
                    className={`flex hover:bg-violet-200 items-center justify-between gap-2 w-full rounded-lg px-3 py-2 font-medium transition ${
                      isCmsActive ? "text-violet-700 bg-violet-200" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {navItems[1].icon} CMS
                    </div>
                    {cmsDropdown || isCmsActive ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                  {(cmsDropdown || isCmsActive) && (
                    <div className="ml-6 flex flex-col gap-0.5">
                      {cmsNavItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                        >
                          <div
                            className={`flex hover:bg-violet-200 items-center gap-2 rounded-lg p-2 cursor-pointer transition ${
                              pathname.startsWith(item.href)
                                ? "text-violet-700 bg-violet-200 font-medium"
                                : ""
                            }`}
                          >
                            {item.icon} {item.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}

              {show("donations") && (
                <Link href="/donation" onClick={() => setIsOpen(false)}>
                  <div
                    className={`flex hover:bg-violet-200 items-center gap-2 rounded-lg px-3 py-2 cursor-pointer font-medium transition ${getNavClass(
                      "/donation"
                    )}`}
                  >
                    {navItems[2].icon} {navItems[2].name}
                  </div>
                </Link>
              )}

              {show("donors") && (
                <Link href="/donors" onClick={() => setIsOpen(false)}>
                  <div
                    className={`flex hover:bg-violet-200 items-center gap-2 rounded-lg px-3 py-2 cursor-pointer font-medium transition ${getNavClass(
                      "/donors"
                    )}`}
                  >
                    {navItems[3].icon} {navItems[3].name}
                  </div>
                </Link>
              )}

              {show("settings") && (
                <Link href="/settings" onClick={() => setIsOpen(false)}>
                  <div
                    className={`flex hover:bg-violet-200 items-center gap-2 rounded-lg px-3 py-2 cursor-pointer font-medium transition ${getNavClass(
                      "/settings"
                    )}`}
                  >
                    {navItems[4].icon} {navItems[4].name}
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>

        <main className="flex-1 sm:p-6 p-0 bg-gray-100 w-full max-h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

const NavBar = ({ user, isOpen, setIsOpen, role }) => {
  return (
    <nav className="flex items-center justify-between w-full p-4 sm:px-12 border-b border-gray-200 h-[10dvh]">
      <div className="flex flex-row gap-3 items-center">
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800">
            <Menu size={28} />
          </button>
        </div>

        <Image src={Logo} alt="Wahid" height={40} />
        <h1 className="text-xl font-semibold sm:block hidden">WAHID</h1>
      </div>

      {user && (
        <div className="flex flex-row gap-4 items-center">
          <div className="text-right">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="cursor-pointer hover:bg-red-200 rounded-full p-2.5 border border-gray-300 transition hover:border-red-300"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </nav>
  );
};
