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
  CalendarDays,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Logo from "../../public/logo.png";
import { TbCategory } from "react-icons/tb";
import { RiPagesLine } from "react-icons/ri";
import { VscLayoutPanelJustify } from "react-icons/vsc";
import { FcAbout } from "react-icons/fc";

const cmsNavItems = [
  { name: "Home", href: "/home", icon: <LayoutDashboard size={16} /> },
  { name: "Projects", href: "/projects", icon: <FolderKanban size={16} /> },
  { name: "Impact", href: "/impact", icon: <BookOpen size={16} /> },
  { name: "About", href: "/about", icon: <FcAbout size={16} /> },
  { name: "Volunteers", href: "/volunteers/list", icon: <Users size={16} /> },
  { name: "Blogs", href: "/blogs", icon: <RiPagesLine size={16} /> },
  { name: "Categories", href: "/categories", icon: <TbCategory size={16} /> },
  { name: "Footer", href: "/footer", icon: <VscLayoutPanelJustify size={16} /> },
];

// Grouped nav, mirroring the reference's sectioned sidebar
const groups = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", key: "dashboard", href: "/", icon: <LayoutDashboard size={17} /> },
      { name: "Donation", key: "donations", href: "/donation", icon: <Handshake size={17} /> },
      { name: "Donors", key: "donors", href: "/donors", icon: <Users size={17} /> },
      { name: "Influencers", key: "donations", href: "/influencers", icon: <Megaphone size={17} /> },
    ],
  },
  {
    label: "Configuration",
    items: [
      { name: "Settings", key: "settings", href: "/settings", icon: <SettingsIcon size={17} /> },
      { name: "Tracking Scripts", key: "settings", href: "/tracking", icon: <LineChart size={17} /> },
    ],
  },
];

const itemBase =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors";
const itemIdle = "text-gray-600 hover:bg-black/[0.04] hover:text-gray-900";
const itemActive = "bg-emerald-100 text-emerald-900 font-semibold";

const STORAGE_KEY = "wf_admin_sidebar_collapsed";

export default function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [cmsDropdown, setCmsDropdown] = useState(false);
  const [access, setAccess] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

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

  const renderNav = (onNavigate, mini = false) => (
    <nav className="flex flex-col gap-5">
      {groups.map((group) => {
        const items = group.items.filter((i) => show(i.key));
        const showCmsHere = group.label === "Overview" && show("cms");
        if (!items.length && !showCmsHere) return null;
        return (
          <div key={group.label} className="flex flex-col gap-1">
            {!mini && (
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                {group.label}
              </p>
            )}
            {items.map((item) => {
              const node = (
                <div
                  title={mini ? item.name : undefined}
                  className={`${itemBase} ${
                    isActive(item.href) ? itemActive : itemIdle
                  } ${mini ? "justify-center px-2" : ""}`}
                >
                  {item.icon}
                  {!mini && item.name}
                </div>
              );
              return (
                <Link key={item.href} href={item.href} onClick={onNavigate}>
                  {node}
                </Link>
              );
            })}

            {/* CMS lives inside the Overview group */}
            {showCmsHere && (
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
                    } else setCmsDropdown((v) => !v);
                  }}
                  className={`${itemBase} w-full ${
                    isCmsActive ? "bg-black/[0.04] text-gray-900" : itemIdle
                  } ${mini ? "justify-center px-2" : "justify-between"}`}
                >
                  <span className="flex items-center gap-3">
                    <Database size={17} />
                    {!mini && "CMS"}
                  </span>
                  {!mini &&
                    (cmsDropdown || isCmsActive ? (
                      <ChevronUp size={15} />
                    ) : (
                      <ChevronDown size={15} />
                    ))}
                </button>
                {!mini && (cmsDropdown || isCmsActive) && (
                  <div className="ml-4 flex flex-col gap-0.5 border-l border-gray-200 pl-3">
                    {cmsNavItems.map((item) => (
                      <Link key={item.name} href={item.href} onClick={onNavigate}>
                        <div
                          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors ${
                            pathname.startsWith(item.href)
                              ? "bg-emerald-100 font-semibold text-emerald-900"
                              : "text-gray-500 hover:bg-black/[0.04] hover:text-gray-900"
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
          </div>
        );
      })}
    </nav>
  );

  const SidebarSkeleton = () => (
    <div className="flex flex-col gap-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-10 w-full rounded-xl bg-black/[0.05]" />
      ))}
    </div>
  );

  const UserCard = ({ mini }) =>
    !user ? null : mini ? (
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        title="Sign out"
        className="flex w-full items-center justify-center rounded-xl p-2 text-gray-500 hover:bg-black/[0.04] hover:text-gray-900"
      >
        <LogOut size={16} />
      </button>
    ) : (
      <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200/80 bg-white p-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
          {(user.name || "U").slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-gray-900">
            {user.name}
          </p>
          <p className="truncate text-[11px] text-gray-500">{user.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Sign out"
          className="shrink-0 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <LogOut size={15} />
        </button>
      </div>
    );

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="h-screen bg-[#e9eaec] p-2 sm:p-3">
      {/* Floating app shell */}
      <div className="flex h-full flex-col overflow-hidden rounded-[26px] border border-black/5 bg-[#f7f7f8] shadow-[0_20px_60px_-30px_rgba(16,24,40,0.35)]">
        {/* ---------- Top bar ---------- */}
        <header className="flex h-[62px] shrink-0 items-center justify-between gap-3 px-3 sm:px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(true)}
              className="rounded-xl p-2 text-gray-600 hover:bg-black/[0.04] md:hidden"
              aria-label="Open menu"
            >
              <Menu size={19} />
            </button>

            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-950">
              <Image src={Logo} alt="Wahid" height={20} />
            </span>

            <button
              onClick={toggleCollapsed}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden rounded-xl p-2 text-gray-500 transition hover:bg-black/[0.04] hover:text-gray-900 md:inline-flex"
            >
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="chip hidden text-gray-600 sm:inline-flex">
              <CalendarDays size={14} className="text-gray-400" />
              {today}
            </span>
            {user && (
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-black/5 bg-white py-1 pl-1 pr-3 transition hover:bg-gray-50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
                  {(user.name || "U").slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden text-[13px] font-semibold text-gray-800 sm:block">
                  {user.name}
                </span>
              </Link>
            )}
          </div>
        </header>

        {/* ---------- Body: sidebar + content ---------- */}
        <div className="flex min-h-0 flex-1">
          {/* Light sidebar */}
          <aside
            className={`hidden shrink-0 flex-col justify-between px-3 pb-3 transition-[width] duration-200 md:flex ${
              collapsed ? "w-[74px]" : "w-[236px]"
            }`}
          >
            <div className="min-h-0 flex-1 overflow-y-auto">
              {loading ? <SidebarSkeleton /> : renderNav(undefined, collapsed)}
            </div>
            <div className="pt-3">
              <UserCard mini={collapsed} />
            </div>
          </aside>

          {/* Content surface — shares the shell tint so white cards float on it */}
          <main className="min-w-0 flex-1 overflow-y-auto px-3 pb-3 sm:px-4 sm:pb-4">
            {children}
          </main>
        </div>
      </div>

      {/* ---------- Mobile drawer ---------- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[264px] flex-col bg-[#f7f7f8] p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-950">
                  <Image src={Logo} alt="Wahid" height={20} />
                </span>
                <p className="text-sm font-extrabold text-gray-900">WAHID</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-black/[0.04]"
              >
                <X size={19} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {loading ? <SidebarSkeleton /> : renderNav(() => setIsOpen(false))}
            </div>
            <div className="pt-3">
              <UserCard />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
