"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Users, Bot, CheckSquare, BarChart3,
  Settings, LogOut, Bot as BotIcon, Cpu, Mic, Gauge, ShieldCheck
} from "lucide-react"
import { signOut } from "next-auth/react"

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
  badge?: number
}

export function AppSidebar({
  userName,
  userEmail,
  planLabel,
  pendingApprovals,
  isAdmin,
}: {
  userName: string | null
  userEmail: string | null
  planLabel: string | null
  pendingApprovals: number
  isAdmin: boolean
}) {
  const pathname = usePathname()

  const sections: { title: string; items: NavItem[] }[] = [
    {
      title: "Review Hub",
      items: [
        { href: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
        { href: "/app/approvals", label: "Approve Work", icon: CheckSquare, badge: pendingApprovals },
        { href: "/app/leads", label: "Leads (CRM)", icon: Users },
        { href: "/app/reports", label: "Reports", icon: BarChart3 },
      ],
    },
    {
      title: "Your AI Employee",
      items: [
        { href: "/app/agent", label: "Chat With It", icon: Bot },
        { href: "/app/agents", label: "Its Skills", icon: Cpu },
        { href: "/app/voice", label: "Voice Calls", icon: Mic },
      ],
    },
    {
      title: "Account",
      items: [
        { href: "/app/usage", label: "Usage & Credits", icon: Gauge },
        { href: "/app/settings", label: "Settings", icon: Settings },
      ],
    },
  ]

  const initial = (userName ?? userEmail ?? "?")[0].toUpperCase()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-60 border-r border-slate-800 bg-slate-950 flex flex-col">
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <Link href="/app" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
            <BotIcon className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold">GrowthAgent OS</span>
        </Link>
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
                    {item.badge && item.badge > 0 ? (
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

        {isAdmin && (
          <div>
            <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              Platform
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400/90 hover:text-red-300 hover:bg-red-500/10 transition-all"
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Admin Console
            </Link>
          </div>
        )}
      </nav>

      {/* Account footer */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold truncate">{userName ?? userEmail ?? "Account"}</div>
            {planLabel && (
              <div className="text-[10px] text-slate-500 truncate">{planLabel} plan</div>
            )}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Sign out"
            className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
