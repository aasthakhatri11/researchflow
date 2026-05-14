import { useState } from "react"

export default function Chat({ sessionId, filename, onReset }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, query: input }),
      })
      const data = await res.json()

      const assistantMessage = {
        role: "assistant",
        content: data.answer || `[Source: ${data.source} | Confidence: ${data.confidence}]\n\nChunks found: ${data.chunks_found}`,
        source: data.source,
        confidence: data.confidence,
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400">Chatting with</p>
          <p className="font-medium">{filename}</p>
        </div>
        <button onClick={onReset} className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Upload new
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-12">Ask anything about your document</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] px-4 py-3 rounded-xl text-sm whitespace-pre-wrap
              ${m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"}`}>
              {m.content}
              {/* Show source badge for assistant messages */}
              {m.source && (
                <div className="mt-2 flex gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${m.source === "web" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>
                    {m.source === "web" ? "🌐 Web" : "📄 Document"}
                  </span>
                  <span className="text-xs text-gray-500">confidence: {m.confidence}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 px-4 py-3 rounded-xl text-sm text-gray-400">Thinking...</div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors"
          placeholder="Ask a question about your document..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-5 py-3 rounded-xl text-sm font-medium transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}