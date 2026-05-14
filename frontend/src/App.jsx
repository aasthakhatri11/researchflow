import { useState } from "react"
import Upload from "./components/Upload"
import Chat from "./components/Chat"

export default function App() {
  const [sessionId, setSessionId] = useState(null)
  const [filename, setFilename] = useState(null)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <h1 className="text-xl font-semibold">ResearchFlow</h1>
        <p className="text-sm text-gray-400">Hybrid Research Assistant</p>
      </div>

      {/* Main */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {!sessionId ? (
          // Show upload screen if no session yet
          <Upload onUpload={(id, name) => { setSessionId(id); setFilename(name) }} />
        ) : (
          // Show chat screen once a PDF is uploaded
          <Chat sessionId={sessionId} filename={filename} onReset={() => setSessionId(null)} />
        )}
      </div>
    </div>
  )
}