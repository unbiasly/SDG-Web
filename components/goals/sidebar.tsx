import type React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Home,
  Users,
  Briefcase,
  Bell,
  Bookmark,
  Video,
  Search,
  Target,
  User,
  Settings,
  BadgeIcon as Mentor,
} from "lucide-react"

export default function Sidebar() {
  return (
    <div className="w-64 border-r h-screen overflow-auto">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-xs">🌍</span>
          </div>
          <span className="font-semibold">The SDG Story</span>
        </div>

        <div className="border rounded-lg p-4 mb-4">
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
              <Image
                src="/placeholder.svg?height=64&width=64"
                alt="Profile"
                width={64}
                height={64}
                className="bg-gray-200"
              />
            </div>
            <h3 className="font-bold">Full Name</h3>
            <p className="text-xs text-gray-500">@username</p>
            <p className="text-xs text-gray-500">mail@website.com</p>
          </div>

          <div className="flex justify-between text-xs text-gray-500 mb-4">
            <div>
              <span className="font-bold">000</span> Followers
            </div>
            <div>
              <span className="font-bold">000</span> Following
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          <NavItem href="/" icon={<Home size={18} />} label="Home" />
          <NavItem href="/society" icon={<Users size={18} />} label="The SDG Society" />
          <NavItem href="/mentorship" icon={<Mentor size={18} />} label="Mentorship" />
          <NavItem href="/internship" icon={<Briefcase size={18} />} label="Internship" />
          <NavItem href="/job" icon={<Briefcase size={18} />} label="Job" />
          <NavItem href="/notifications" icon={<Bell size={18} />} label="Notifications" />
          <NavItem href="/bookmarks" icon={<Bookmark size={18} />} label="Bookmarks" />
          <NavItem href="/videos" icon={<Video size={18} />} label="Videos" />
          <NavItem href="/search" icon={<Search size={18} />} label="Scheme Search" />
          <NavItem href="/goals" icon={<Target size={18} />} label="The 17 Goals" isActive />
          <NavItem href="/profile" icon={<User size={18} />} label="Profile" />
          <NavItem href="/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>
      </div>
    </div>
  )
}

function NavItem({
  href,
  icon,
  label,
  isActive = false,
}: {
  href: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-2 py-2 rounded-md ${
        isActive ? "text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

