'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { TopBar } from '@/components/dashboard/TopBar'
import { Send, Loader2, MessageCircle } from 'lucide-react'

interface Message {
  id: string
  sender: 'admin' | 'user'
  content: string
  read: boolean
  created_at: string
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading,  setLoading]  = useState(true)
  const [input,    setInput]    = useState('')
  const [sending,  setSending]  = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const fetchMessages = useCallback(async () => {
    const res = await fetch('/api/messages')
    if (res.ok) {
      const { data } = await res.json()
      setMessages(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchMessages()
    const id = setInterval(fetchMessages, 10_000)
    return () => clearInterval(id)
  }, [fetchMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || sending) return
    setSending(true)
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input.trim() }),
    })
    if (res.ok) {
      const { data } = await res.json()
      setMessages(prev => [...prev, data])
      setInput('')
    }
    setSending(false)
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar title="Messages" subtitle="Support &amp; Admin Chat" />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 max-w-2xl w-full mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 size={24} className="animate-spin text-red-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-14 h-14 rounded-full bg-light-surface dark:bg-dark-card border border-light-border dark:border-dark-border flex items-center justify-center mb-4">
              <MessageCircle size={24} className="text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-dark-base dark:text-white mb-1">No messages yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Send a message and our support team will reply shortly.</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                msg.sender === 'user'
                  ? 'bg-red-primary text-white rounded-br-sm'
                  : 'bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border text-dark-base dark:text-white rounded-bl-sm'
              }`}>
                {msg.sender === 'admin' && (
                  <p className="text-[10px] font-bold text-red-primary dark:text-red-primary mb-1 uppercase tracking-wider">Support</p>
                )}
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className={`text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-white/60' : 'text-slate-400'}`}>
                  {formatTime(msg.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-light-border dark:border-dark-border bg-light-base dark:bg-dark-base p-4">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 px-4 py-2.5 border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-card text-dark-base dark:text-white text-sm focus:outline-none focus:border-red-primary transition-colors rounded-xl placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="flex items-center gap-2 px-4 h-10 bg-red-primary hover:bg-red-dim disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors flex-shrink-0"
          >
            {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            <span>{sending ? 'Sending…' : 'Send'}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
