import Link from "next/link"
import { Bot } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">GrowthAgent OS</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs">
              AI agents that turn enquiries into qualified sales opportunities. Built for digital businesses serious about revenue.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3 text-slate-300">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/demo" className="hover:text-white transition-colors">Live Demo</Link></li>
              <li><Link href="/book-demo" className="hover:text-white transition-colors">Book a Walkthrough</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3 text-slate-300">Account</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Get Started</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} GrowthAgent OS. All rights reserved.</p>
          <p className="text-xs text-slate-500">Premium AI operations for digital businesses.</p>
        </div>
      </div>
    </footer>
  )
}
