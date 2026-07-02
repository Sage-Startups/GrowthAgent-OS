"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { demoChatScript, demoChatFallback, demoCompany } from "@/lib/demo-data"
import { Bot, Send, ArrowRight, Sparkles } from "lucide-react"

type Message = { role: "user" | "assistant"; content: string }

const INTRO: Message = {
  role: "assistant",
  content: `Morning Maya! I've been through everything that came in overnight. 3 things are waiting on your approval, and Sarah Chen at TechFlow is your hottest opportunity right now. What would you like to know?`,
}

export default function DemoChatPage() {
  const [messages, setMessages] = useState<Message[]>([INTRO])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [usedQuestions, setUsedQuestions] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  const send = (text: string) => {
    if (!text.trim() || typing) return
    const question = text.trim()
    setMessages((prev) => [...prev, { role: "user", content: question }])
    setInput("")
    setTyping(true)

    const scripted = demoChatScript.find(
      (s) => s.question.toLowerCase() === question.toLowerCase()
    )
    const answer = scripted?.answer ?? demoChatFallback
    if (scripted) setUsedQuestions((prev) => [...prev, scripted.question])

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: answer }])
      setTyping(false)
    }, 900)
  }

  const suggestions = demoChatScript.filter((s) => !usedQuestions.includes(s.question))

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2.5">
          Chat with {demoCompany.employeeName}
          <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs">Online</Badge>
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Ask your AI employee about the pipeline — it knows every lead, score and follow-up.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/50 p-5 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            <div
              className={`rounded-2xl px-4 py-3 max-w-[80%] text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-slate-800/80 text-slate-200 rounded-bl-md"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="rounded-2xl rounded-bl-md bg-slate-800/80 px-4 py-3">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {suggestions.map((s) => (
            <button
              key={s.question}
              onClick={() => send(s.question)}
              className="text-xs rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 px-3 py-1.5 hover:bg-blue-500/20 transition-colors"
            >
              {s.question}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        className="flex gap-2 mt-3"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${demoCompany.employeeName}...`}
          className="flex-1"
        />
        <Button type="submit" variant="gradient" disabled={!input.trim() || typing}>
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          Scripted demo — your real {demoCompany.employeeName} answers from live pipeline data.
        </span>
        <Button variant="outline" size="sm" asChild>
          <Link href="/signup">Hire the real thing <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
        </Button>
      </div>
    </div>
  )
}
