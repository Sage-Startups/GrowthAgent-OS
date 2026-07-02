"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Users, Bot, CheckSquare,
  Bot as BotIcon,
} from "lucide-react"

const sections = [
  {
    title: "Review Hub",
    items: [
      { href: "/demo", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/demo/approvals", label: "Approve Work", icon: CheckSquare, badge: 3 },
      { href: "/demo/leads", label: "Leads (CRM)", icon: Users },
    ],
  },
  {
    title: "Your AI Employee",
    items: [
      { href: "/demo/chat", label: "Chat With Ava", icon: Bot },
    ],
  },
]

export function DemoSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-12 bottom-0 left-0 z-40 w-60 border-r border-slate-800 bg-slate-950 hidden md:flex flex-col">
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
            <BotIcon className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold leading-tight">GrowthAgent OS</div>
            <div className="text-[10px] text-blue-400">Demo workspace</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      isActive
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {"badge" in item && item.badge ? (
                      <span className="text-xs bg-yellow-400/20 text-yellow-400 px-1.5 py-0.5 rounded-full font-semibold">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Demo account footer */}
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            M
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold truncate">Maya Thompson</div>
            <div className="text-[10px] text-slate-500 truncate">Sales Team plan · Demo</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
