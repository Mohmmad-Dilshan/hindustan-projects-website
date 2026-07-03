import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, X, Send, ExternalLink, Bot } from 'lucide-react'
import { api } from '@/utils/api'

const PREDEFINED_QUESTIONS = [
  { label: '💰 Pricing Inquiry', text: 'What is your pricing?' },
  { label: '🛠️ Services Offered', text: 'What services do you offer?' },
  { label: '⏰ Business Hours', text: 'What are your business hours?' },
  { label: '📞 How to Contact', text: 'How can I contact you?' },
]

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! Welcome to Hindustan Projects. How can I help you today?',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const handleSendMessage = async (text) => {
    if (!text.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text }])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await api.post('/chatbot/ask', { question: text })
      const data = response.data

      // Add bot message
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: data.answer,
          isAnswered: data.answered,
        },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Sorry, I am having trouble connecting right now. Please try again or use our Contact form.',
          isAnswered: false,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-brand-blue hover:bg-blue-800 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-200 group"
          aria-label="Open Chatbot"
        >
          <MessageSquare className="w-6 h-6 transition-transform group-hover:rotate-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] bg-white rounded-2xl border border-gray-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-brand-blue p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Hindustan Projects Help</h3>
                <p className="text-[10px] text-blue-200 font-medium">Online • Virtual Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs line-height-relaxed ${
                    m.sender === 'user'
                      ? 'bg-brand-blue text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-150 rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                {/* Fallback button if bot couldn't find a direct match */}
                {m.sender === 'bot' && m.isAnswered === false && (
                  <div className="mt-2 pl-2">
                    <Link
                      to="/contact"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-red hover:bg-red-750 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm shadow-red-100"
                    >
                      <span>Go to Contact Form</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-1.5 text-gray-400 pl-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick FAQ Options */}
          {messages.length === 1 && (
            <div className="p-3 bg-white border-t border-gray-100 space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">Common Questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {PREDEFINED_QUESTIONS.map((q) => (
                  <button
                    key={q.text}
                    onClick={() => handleSendMessage(q.text)}
                    className="text-[11px] font-semibold text-gray-600 bg-gray-100 hover:bg-brand-blue hover:text-white px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage(inputValue)
            }}
            className="p-3 bg-white border-t border-gray-200 flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 bg-gray-50 border border-gray-200 focus:border-brand-blue focus:bg-white text-xs rounded-xl px-3 py-2 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="w-8 h-8 rounded-xl bg-brand-blue hover:bg-blue-800 disabled:bg-gray-100 text-white disabled:text-gray-400 flex items-center justify-center shrink-0 transition-all shadow-sm shadow-blue-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
