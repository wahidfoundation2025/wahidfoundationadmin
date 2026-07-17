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
  Megaphone,
  LineChart,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Logo from "../../public/logo.png";
import { TbCategory } from "react-icons/tb";
import { RiPagesLine } from "react-icons/ri";
import { VscLayoutPanelJustify } from "react-icons/vsc";
import { FcAbout } from "react-icons/fc";

const cmsNavItems = [
  { name: "Home", href: "/home", icon: <LayoutDashboard size={17} /> },
  { name: "Projects", href: "/projects", icon: <FolderKanban size={17} /> },
  { name: "Impact", href: "/impact", icon: <BookOpen size={17} /> },
  { name: "About", href: "/about", icon: <FcAbout size={17} /> },
  { name: "Volunteers", href: "/volunteers/list", icon: <Users size={17} /> },
  { name: "Blogs", href: "/blogs", icon: <RiPagesLine size={17} /> },
  { name: "Categories", href: "/categories", icon: <TbCategory size={17} /> },
  { name: "Footer", href: "/footer", icon: <VscLayoutPanelJustify size={17} /> },
];

// Top-level nav (gated by the user's access keys)
const mainNav = [
  { name: "Dashboard", key: "dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
  { name: "Donation", key: "donations", href: "/donation", icon: <Handshake size={18} /> },
  { name: "Donors", key: "donors", href: "/donors", icon: <Users size={18} /> },
  { name: "Influencers", key: "donations", href: "/influencers", icon: <Megaphone size={18} /> },
  { name: "Settings", key: "settings", href: "/settings", icon: <SettingsIcon size={18} /> },
  { name: "Tracking Scripts", key: "settings", href: "/tracking", icon: <LineChart size={18} /> },
];

const itemBase =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors";
const itemIdle = "text-emerald-100/70 hover:bg-white/10 hover:text-white";
const itemActive = "bg-emerald-600 text-white shadow-sm";

const STORAGE_KEY = "wf_admin_sidebar_collapsed";

export default function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [cmsDropdown, setCmsDropdown] = useState(false);
  const [access, setAccess] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  // Remember the collapsed preference across sessions.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setCollapsed(true);
    } catch {}
  }, []);
  const toggleCollapsed = () =>
    setCollapsed((v) => {
      try {
        localStorage.setItem(STORAGE_KEY, v ? "0" : "1");
      } catch {}
      return !v;
    });

  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const isCmsActive = cmsNavItems.some((i) => pathname.startsWith(i.href));

  const fetchAccess = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${encodeURIComponent(user.email)}`);
      if (!res.ok) throw new Error("Access fetch failed");
      const data = await res.json();
      setAccess(data.access || []);
      setRole(data.role || "");
    } catch (err) {
      console.error("Failed to load user access:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchAccess();
  }, [user]);

  const show = (key) => access.includes(key);

  // Shared nav markup. `mini` renders the collapsed icon-only rail.
  const renderNav = (onNavigate, mini = false) => (
    <nav className="flex flex-col gap-1">
      {show("dashboard") && (
        <Link href="/" onClick={onNavigate}>
          <div
            title={mini ? "Dashboard" : undefined}
            className={`${itemBase} ${isActive("/") ? itemActive : itemIdle} ${
              mini ? "justify-center px-2" : ""
            }`}
          >
            <LayoutDashboard size={18} />
            {!mini && "Dashboard"}
          </div>
        </Link>
      )}

      {show("cms") && (
        <>
          <button
            title={mini ? "CMS" : undefined}
            onClick={() => {
              if (mini) {
                setCollapsed(false);
                try {
                  localStorage.setItem(STORAGE_KEY, "0");
                } catch {}
                setCmsDropdown(true);
              } else {
                setCmsDropdown((v) => !v);
              }
            }}
            className={`${itemBase} w-full ${
              isCmsActive ? "bg-white/10 text-white" : itemIdle
            } ${mini ? "justify-center px-2" : "justify-between"}`}
          >
            <span className="flex items-center gap-3">
              <Database size={18} />
              {!mini && "CMS"}
            </span>
            {!mini &&
              (cmsDropdown || isCmsActive ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              ))}
          </button>

          {!mini && (cmsDropdown || isCmsActive) && (
            <div className="ml-4 flex flex-col gap-0.5 border-l border-white/10 pl-3">
              {cmsNavItems.map((item) => (
                <Link key={item.name} href={item.href} onClick={onNavigate}>
                  <div
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors ${
                      pathname.startsWith(item.href)
                        ? "bg-emerald-600 font-medium text-white"
                        : "text-emerald-100/60 hover:bg-white/10 hover:text-white"
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

      {mainNav
        .filter((i) => i.key !== "dashboard" && show(i.key))
        .map((item) => (
          <Link key={item.href} href={item.href} onClick={onNavigate}>
            <div
              title={mini ? item.name : undefined}
              className={`${itemBase} ${
                isActive(item.href) ? itemActive : itemIdle
              } ${mini ? "justify-center px-2" : ""}`}
            >
              {item.icon}
              {!mini && item.name}
            </div>
          </Link>
        ))}
    </nav>
  );

  const SidebarSkeleton = () => (
    <div className="flex flex-col gap-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-10 w-full rounded-xl bg-white/10" />
      ))}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f7f9]">
      {/* ---------- Desktop sidebar (dark, collapsible) ---------- */}
      <aside
        className={`hidden shrink-0 flex-col bg-emerald-950 transition-[width] duration-200 md:flex ${
          collapsed ? "w-[76px]" : "w-[264px]"
        }`}
      >
        <div
          className={`flex items-center py-5 ${
            collapsed ? "justify-center px-2" : "gap-2.5 px-5"
          }`}
        >
          <Image src={Logo} alt="Wahid" height={34} className="rounded-md" />
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-base font-extrabold tracking-tight text-white">
                WAHID
              </p>
              <p className="text-[11px] text-emerald-300/70">Admin Panel</p>
            </div>
          )}
        </div>

        <div
          className={`flex-1 overflow-y-auto pb-4 ${collapsed ? "px-2" : "px-3"}`}
        >
          {loading ? <SidebarSkeleton /> : renderNav(undefined, collapsed)}
        </div>

        {user && (
          <div className="border-t border-white/10 p-3">
            {collapsed ? (
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                title="Sign out"
                className="flex w-full items-center justify-center rounded-lg p-2 text-emerald-100/70 transition hover:bg-white/10 hover:text-white"
              >
                <LogOut size={16} />
              </button>
            ) : (
              <div className="flex items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-[11px] capitalize text-emerald-300/70">
                    {role || "—"}
                  </p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  title="Sign out"
                  className="shrink-0 rounded-lg p-2 text-emerald-100/70 transition hover:bg-white/10 hover:text-white"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* ---------- Mobile drawer ---------- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[270px] flex-col bg-emerald-950">
            <div className="flex items-center justify-between px-5 py-5">
              <div className="flex items-center gap-2.5">
                <Image src={Logo} alt="Wahid" height={32} className="rounded-md" />
                <p className="text-base font-extrabold text-white">WAHID</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-emerald-100/70 hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-4">
              {loading ? <SidebarSkeleton /> : renderNav(() => setIsOpen(false))}
            </div>
            {user && (
              <div className="border-t border-white/10 p-3">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-emerald-100/70 hover:bg-white/10 hover:text-white"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------- Content ---------- */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar (light) */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e6e8ec] bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="md:hidden">
              <Image src={Logo} alt="Wahid" height={28} />
            </div>

            {/* Collapse / expand the sidebar (desktop) */}
            <button
              onClick={toggleCollapsed}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 md:inline-flex"
            >
              {collapsed ? (
                <PanelLeftOpen size={18} />
              ) : (
                <PanelLeftClose size={18} />
              )}
            </button>
          </div>

          {user && (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition hover:bg-gray-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  {(user.name || "U").slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-semibold leading-tight text-gray-900">
                    {user.name}
                  </span>
                  <span className="block text-[11px] capitalize leading-tight text-gray-500">
                    {role}
                  </span>
                </span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                title="Sign out"
                className="rounded-lg border border-[#e6e8ec] p-2 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
