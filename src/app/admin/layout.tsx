import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Bot, LayoutDashboard, Users, FileText, Activity } from "lucide-react"

async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") redirect("/app")

  return (
    <div className="flex min-h-screen bg-[hsl(222_47%_5%)]">
      <aside className="fixed inset-y-0 left-0 z-40 w-60 border-r border-red-900/30 bg-slate-950 flex flex-col">
        <div className="flex h-16 items-center px-6 border-b border-red-900/30">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-orange-600">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold">GrowthAgent OS</span>
              <div className="text-xs text-red-400 font-medium">Admin</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {[
            { href: "/admin", label: "Overview", icon: LayoutDashboard },
            { href: "/admin/customers", label: "Customers", icon: Users },
            { href: "/admin/leads", label: "All Leads", icon: FileText },
            { href: "/admin/agent-runs", label: "Agent Runs", icon: Activity },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800">
          <Link
            href="/app"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <LayoutDashboard className="h-4 w-4" />
            Back to App
          </Link>
        </div>
      </aside>
      <main className="flex-1 ml-60 p-6 lg:p-8">{children}</main>
    </div>
  )
}

export default AdminLayout
