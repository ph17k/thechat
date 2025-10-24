import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

export default function App() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: 'https://redesigned-goldfish-wvjp566wpqjcvgww-54321.app.github.dev/functions/v1/chat',
    }),
  })
  const [input, setInput] = useState('')

  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'Du: ' : 'Chnurli: '}
          {message.parts.map((part, index) =>
            part.type === 'text' ? <span key={index}>{part.text}</span> : null,
          )}
        </div>
      ))}

      <form
        onSubmit={e => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={status !== 'ready'}
          placeholder="Säg öpis..."
        />
        <button type="submit" disabled={status !== 'ready'}>
          Ab di post!
        </button>
      </form>
    </>
  )
}
