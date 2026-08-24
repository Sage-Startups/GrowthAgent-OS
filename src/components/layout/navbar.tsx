"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bot, LogOut, Settings, User, LayoutDashboard } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()
  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "U"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
            <Bot className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Staff<span className="gradient-text">gent</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/#employees" className="text-slate-400 hover:text-white transition-colors">Employees</Link>
          <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link>
          <Link href="/demo" className="text-slate-400 hover:text-white transition-colors">Live Demo</Link>
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/app"><LayoutDashboard className="h-4 w-4 mr-1.5" />Dashboard</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none">
                    <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-slate-700 hover:ring-blue-500 transition-all">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-600 to-violet-600">{initials}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{session.user?.name ?? session.user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/app"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/app/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-400 focus:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button variant="gradient" size="sm" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
