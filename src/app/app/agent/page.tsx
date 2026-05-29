"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, Sparkles, Zap } from "lucide-react"
import { sendAgentMessage, getAgentMessages } from "@/app/actions/agent-chat"

type Message = {
  role: "user" | "assistant"
  content: string
  createdAt: Date
}

const WELCOME = "Hello! I'm your GrowthAgent. I'm connected to your live pipeline and ready to help.\n\nTry asking me: \"Show me my hot leads\", \"Who needs a follow-up today?\", or \"What is the pipeline value?\""

const suggestions = [
  "Show me my hottest leads",
  "Who needs a follow-up today?",
  "What is the pipeline value?",
  "Summarise this week",
  "Which lead is the best priority?",
]

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getAgentMessages().then((res) => {
      const msgs = res && "messages" in res ? res.messages : undefined
      if (msgs && msgs.length > 0) {
        setMessages(msgs.map((m: any) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
          createdAt: new Date(m.createdAt),
        })))
      }
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const sendMsg = async (text: string) => {
    if (!text.trim() || isTyping) return
    const userMsg: Message = { role: "user", content: text, createdAt: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    const result = await sendAgentMessage(text)
    setIsTyping(false)

    if (result && "message" in result && result.message) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: result.message.content,
        createdAt: new Date(result.message.createdAt),
      }])
    } else if (result && "error" in result) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: `Sorry, something went wrong: ${result.error}`,
        createdAt: new Date(),
      }])
    }
  }

  const displayMessages = messages.length > 0 ? messages : (loaded ? [{ role: "assistant" as const, content: WELCOME, createdAt: new Date() }] : [])

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
              {displayMessages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user" ? "bg-blue-600 text-white ml-auto" : "bg-slate-800 text-slate-200"
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
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-slate-800 shrink-0">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMsg(input)}
                placeholder="Ask about your pipeline, request actions, or get lead insights..."
                className="flex-1"
              />
              <Button variant="gradient" size="icon" onClick={() => sendMsg(input)} disabled={isTyping || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

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
                  onClick={() => sendMsg(s)}
                  disabled={isTyping}
                  className="w-full text-left rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2 text-xs text-slate-300 hover:border-blue-500/40 hover:bg-slate-800/70 hover:text-white transition-all disabled:opacity-50"
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
                { label: "Reply Generation", status: "Active", color: "text-emerald-400" },
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
