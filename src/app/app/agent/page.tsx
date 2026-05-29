"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, Sparkles, Zap } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Hello! I am your GrowthAgent. I have been monitoring your pipeline and I am ready to help.\n\nYou currently have **8 HOT leads** and **3 approvals** waiting for your review. The top priority today is Sarah Chen from Fintech Agency — her draft reply is ready and she showed strong buying intent.\n\nWhat would you like to work on?",
    timestamp: new Date(Date.now() - 60000),
  },
]

const suggestions = [
  "Show me my hottest leads",
  "Who needs a follow-up today?",
  "Draft a follow-up for Marcus Webb",
  "What is the pipeline value this week?",
]

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { role: "user", content: text, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    await new Promise((r) => setTimeout(r, 1200))

    const responses: Record<string, string> = {
      default: "I understand. Let me look into that for you. Based on your current pipeline data, I can see several opportunities worth discussing. Would you like me to generate a detailed analysis or take a specific action?",
      "show me my hottest leads": "Your 3 hottest leads right now are:\n\n1. **Sarah Chen** (Fintech Agency) — Score 87/100, Est. £12k. Draft reply ready.\n2. **Priya Sharma** (SaaS Launch HQ) — Score 91/100, Est. £18k. Research complete.\n3. **David Kim** (Consulting DG) — Score 82/100, Est. £15k. Call booked.\n\nAll three have shown strong buying intent. I recommend approving the draft replies today.",
      "who needs a follow-up today?": "Three leads are due for follow-up today:\n\n1. **Marcus Webb** — Last contact 4 days ago. Warm lead, hasn't replied to initial outreach.\n2. **Tom Rigby** — Follow-up was scheduled for today. He requested more info on pricing.\n3. **Emma Foster** — Called last Tuesday, said she would decide this week.\n\nWould you like me to draft follow-up messages for any of these?",
      "draft a follow-up for marcus webb": "Here is a draft follow-up for Marcus Webb at BuilderBrand Co:\n\n---\nHi Marcus,\n\nJust circling back on my previous message — I know things get busy!\n\nI wanted to share a quick example of how we helped a similar branding agency reduce their lead response time from 2 days to under 2 hours using GrowthAgent OS.\n\nWould a 15-minute call this week be useful to explore if it could work for BuilderBrand Co?\n\nBest,\n[Your name]\n---\n\nShall I add this to your approval queue?",
      "what is the pipeline value this week?": "Here is your pipeline summary for this week:\n\n- **Total pipeline value:** £84,500\n- **Hot leads (8):** £65,000 combined est. value\n- **Warm leads (14):** £19,500 combined est. value\n- **New leads added:** 6\n- **Change vs last week:** +£12,000 (+16%)\n\nYour strongest opportunity is Priya Sharma at SaaS Launch HQ — estimated at £18k and she came in via referral.",
    }

    const key = text.toLowerCase()
    const response = responses[key] || responses.default

    setMessages((prev) => [...prev, { role: "assistant", content: response, timestamp: new Date() }])
    setIsTyping(false)
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Agent Chat</h1>
          <p className="text-slate-400 mt-1">Your AI sales operator — ask anything about your pipeline</p>
        </div>
        <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse inline-block" />
          Agent Active
        </Badge>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Chat */}
        <Card className="border-slate-800 lg:col-span-3 flex flex-col min-h-0">
          <CardHeader className="pb-3 border-b border-slate-800 shrink-0">
            <CardTitle className="text-sm flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
              GrowthAgent
              <span className="text-xs font-normal text-slate-500 ml-1">— pipeline intelligence</span>
            </CardTitle>
          </CardHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white ml-auto"
                      : "bg-slate-800 text-slate-200"
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="h-7 w-7 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="h-3.5 w-3.5 text-slate-300" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shrink-0">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="bg-slate-800 rounded-xl px-4 py-3 flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-slate-800 shrink-0">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                placeholder="Ask about your pipeline, request actions, or get lead insights..."
                className="flex-1"
              />
              <Button variant="gradient" size="icon" onClick={() => sendMessage(input)} disabled={isTyping || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Suggestions */}
        <div className="space-y-4">
          <Card className="border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-400" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="w-full text-left rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2 text-xs text-slate-300 hover:border-blue-500/40 hover:bg-slate-800/70 hover:text-white transition-all"
                >
                  {s}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400" /> Agent Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2.5">
              {[
                { label: "Lead Research", status: "Active", color: "text-emerald-400" },
                { label: "Lead Scoring", status: "Active", color: "text-emerald-400" },
                { label: "Draft Replies", status: "3 queued", color: "text-yellow-400" },
                { label: "Follow-Up Agent", status: "Monitoring", color: "text-blue-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{item.label}</span>
                  <span className={`text-xs font-medium ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
