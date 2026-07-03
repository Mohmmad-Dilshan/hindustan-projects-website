import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, X, Send, ExternalLink, Bot, Sparkles } from 'lucide-react'
import { api } from '@/utils/api'

const QUICK_QUESTIONS = [
  { emoji: '💰', label: 'Pricing', text: 'What is your pricing?' },
  { emoji: '🛠️', label: 'Services', text: 'What services do you offer?' },
  { emoji: '⏰', label: 'Timings', text: 'What are your business hours?' },
  { emoji: '📞', label: 'Contact', text: 'How can I contact you?' },
]

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '👋 Hello! Welcome to **Hindustan Projects**. How can I help you today? You can ask me about our services, pricing, timings, or contact info.',
      isAnswered: true,
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200)
  }, [isOpen])

  const renderText = (text) => {
    // Simple bold markdown support: **text**
    return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="font-bold">
          {part}
        </strong>
      ) : (
        part
      )
    )
  }

  const handleSend = async (text) => {
    const msg = text.trim()
    if (!msg || isLoading) return

    setMessages((prev) => [...prev, { sender: 'user', text: msg }])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await api.post('/chatbot/ask', { question: msg })
      const data = response.data
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: data.answer,
          isAnswered: data.answered,
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "Sorry, I'm having trouble connecting right now. Please use our Contact form or WhatsApp us directly.",
          isAnswered: false,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const showQuickButtons = messages.length <= 1

  return (
    <div className="fixed bottom-6 right-6 z-50" style={{ fontFamily: 'inherit' }}>
      {/* ── Floating Toggle Button ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Chat Assistant"
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
          style={{ backgroundColor: '#1a3e8c' }}
        >
          {/* Pulse ring */}
          <span
            className="absolute inset-0 rounded-full opacity-40 animate-ping"
            style={{ backgroundColor: '#1a3e8c' }}
          />
          <MessageCircle className="w-6 h-6 text-white relative z-10" />
          {/* Tooltip */}
          <span className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 pointer-events-none shadow-lg">
            Chat with us!
          </span>
        </button>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div
          className="flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{
            width: '360px',
            height: '520px',
            border: '1px solid #e5e7eb',
            animation: 'slideUp 0.2s ease-out',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ backgroundColor: '#1a3e8c' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <Bot className="w-5 h-5" style={{ color: '#ffffff' }} />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight" style={{ color: '#ffffff' }}>
                  Hindustan Projects
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: '#4ade80' }}
                  />
                  <p className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Virtual Assistant • Online
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: 'rgba(255,255,255,0.7)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
              }}
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: '#f8fafc' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col gap-1 ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#1a3e8c' }}
                    >
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Assistant
                    </span>
                  </div>
                )}
                <div
                  className="max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed"
                  style={
                    m.sender === 'user'
                      ? {
                          backgroundColor: '#1a3e8c',
                          color: '#ffffff',
                          borderTopRightRadius: '4px',
                        }
                      : {
                          backgroundColor: '#ffffff',
                          color: '#1f2937',
                          borderTopLeftRadius: '4px',
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        }
                  }
                >
                  {renderText(m.text)}
                </div>

                {/* Contact button when bot can't answer */}
                {m.sender === 'bot' && m.isAnswered === false && (
                  <div className="flex gap-2 mt-1">
                    <Link
                      to="/contact"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white transition-all"
                      style={{ backgroundColor: '#dc2626' }}
                    >
                      <span>Open Contact Form</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            ))}

            {/* Loading dots */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: '#1a3e8c' }}
                >
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div
                  className="flex items-center gap-1.5 px-4 py-3 rounded-2xl"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderTopLeftRadius: '4px',
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: '#1a3e8c', animationDelay: '0ms' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: '#1a3e8c', animationDelay: '150ms' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: '#1a3e8c', animationDelay: '300ms' }}
                  />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Questions */}
          {showQuickButtons && (
            <div className="px-3 pt-2 pb-1 shrink-0" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #f3f4f6' }}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-1">
                Quick Questions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q.text}
                    onClick={() => handleSend(q.text)}
                    className="text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-all"
                    style={{
                      color: '#1a3e8c',
                      borderColor: '#bfdbfe',
                      backgroundColor: '#eff6ff',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1a3e8c'
                      e.currentTarget.style.color = '#ffffff'
                      e.currentTarget.style.borderColor = '#1a3e8c'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#eff6ff'
                      e.currentTarget.style.color = '#1a3e8c'
                      e.currentTarget.style.borderColor = '#bfdbfe'
                    }}
                  >
                    {q.emoji} {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend(inputValue)
            }}
            className="flex items-center gap-2 px-3 py-3 shrink-0"
            style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 text-[13px] rounded-xl px-3.5 py-2.5 outline-none transition-all"
              style={{
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                color: '#1f2937',
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#ffffff'
                e.target.style.borderColor = '#1a3e8c'
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#f1f5f9'
                e.target.style.borderColor = '#e2e8f0'
              }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
              style={{
                backgroundColor: inputValue.trim() && !isLoading ? '#1a3e8c' : '#e5e7eb',
                color: inputValue.trim() && !isLoading ? '#ffffff' : '#9ca3af',
              }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
      `}</style>
    </div>
  )
}
