import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import './App.css'

export default function App() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: 'https://redesigned-goldfish-wvjp566wpqjcvgww-54321.app.github.dev/functions/v1/chat',
    }),
  })
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status === 'ready') {
      sendMessage({ text: input });
      setInput('');
    }
  }

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-content">
          <div className="bot-avatar">
            <div className="bot-icon">🤖</div>
          </div>
          <div className="bot-info">
            <h1 className="bot-name">Chätbot</h1>
            <p className="bot-status">
              {status === 'ready' ? 'Online' : status === 'loading' ? 'Typing...' : 'Connecting...'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome-message">
              <div className="welcome-content">
                <div className="welcome-icon">🖕</div>
                <h2>Was wotsch?!</h2>
              </div>
            </div>
          )}

          {messages.map(message => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-avatar">
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  {message.parts.map((part, index) =>
                    part.type === 'text' ? <span key={index}>{part.text}</span> : null,
                  )}
                </div>
                <div className="message-time">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={status !== 'ready'}
              placeholder="Da chasch öpis schriibe..."
              className="message-input"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={status !== 'ready' || !input.trim()}
              className="send-button"
              aria-label="Send message"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
