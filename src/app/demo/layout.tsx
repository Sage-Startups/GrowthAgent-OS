import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DemoSidebar } from "@/components/demo/demo-sidebar"
import { Sparkles, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Live Demo — GrowthAgent OS",
  description: "Explore a sample workspace and see what it's like to own an AI employee.",
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[hsl(222_47%_5%)] flex flex-col">
      {/* Demo mode banner */}
      <div className="sticky top-0 z-50 border-b border-blue-500/20 bg-gradient-to-r from-blue-950/90 via-slate-950/95 to-violet-950/90 backdrop-blur">
        <div className="flex items-center gap-3 px-4 h-12">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 shrink-0">
            <Sparkles className="h-3.5 w-3.5" />
            Live Demo
          </span>
          <span className="text-xs text-slate-400 truncate hidden sm:block">
            You&apos;re inside <span className="text-slate-200 font-medium">Bright Digital Agency&apos;s</span> workspace — sample data, fully clickable
          </span>
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-400" asChild>
              <Link href="/">Exit demo</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
              <Link href="/book-demo">Book a walkthrough</Link>
            </Button>
            <Button variant="gradient" size="sm" className="h-8 text-xs" asChild>
              <Link href="/signup">
                Hire Your AI Employee <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        <DemoSidebar />
        <main className="flex-1 md:ml-60 min-h-[calc(100vh-3rem)]">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
