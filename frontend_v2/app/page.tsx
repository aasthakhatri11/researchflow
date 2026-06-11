'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Header } from '@/components/header'
import { ChatSidebar } from '@/components/chat-sidebar'
import { PDFViewer } from '@/components/pdf-viewer'
import { ChatInterface } from '@/components/chat-interface'
import { OwlMascot } from '@/components/owl-mascot'
import { UploadLanding } from '@/components/upload_landing'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatSession {
  id: string
  name: string
  timestamp: Date
  preview: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  source?: { type: 'document' | 'web'; page?: number }
  confidence?: number
  suggestions?: string[]
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResearchFlowPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showLanding, setShowLanding] = useState(true)

  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  const [pdfFileName, setPdfFileName] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isPdfCollapsed, setIsPdfCollapsed] = useState(false)

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [mode, setMode] = useState<'beginner' | 'technical' | 'academic'>('technical')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Init dark mode ──────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  // ── Load sessions on mount ──────────────────────────────────────────────────
  useEffect(() => {
    loadSessions()
  }, [])

  useEffect(() => {
    if (!activeSessionId) return
    loadSessionMessages(activeSessionId)
  }, [activeSessionId])

  // ── API helpers ─────────────────────────────────────────────────────────────

  async function loadSessions() {
    try {
      const res = await fetch(`${API}/api/sessions`)
      const data = await res.json()
      const mapped: ChatSession[] = (data || []).map((s: {
        session_id: string
        filename?: string
        created_at?: string
        messages?: { content: string }[]
      }) => ({
        id: s.session_id,
        name: s.filename || 'Untitled',
        timestamp: new Date(s.created_at || Date.now()),
        preview: s.messages?.[0]?.content?.slice(0, 60) || '',
      }))
      setSessions(mapped)
    } catch (err) {
      console.error('Failed to load sessions:', err)
    }
  }

  async function loadSessionMessages(sessionId: string) {
    try {
      const res = await fetch(`${API}/api/sessions/${sessionId}`)
      const data = await res.json()
      if (data.filename) setPdfFileName(data.filename)
      if (data.messages && data.messages.length > 0) {
        const mapped: Message[] = data.messages.map((m: {
          role: string
          content: string
          meta?: { source?: string; confidence?: number; page?: number }
        }, idx: number) => ({
          id: String(idx),
          role: m.role as 'user' | 'assistant',
          content: m.content,
          source: m.meta?.source
            ? { type: m.meta.source as 'document' | 'web', page: m.meta.page }
            : undefined,
          confidence: m.meta?.confidence,
        }))
        setMessages(mapped)
      } else {
        setMessages([])
      }
    } catch (err) {
      console.error('Failed to load session messages:', err)
      setMessages([])
    }
  }

  // ── Theme ───────────────────────────────────────────────────────────────────

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return next
    })
  }, [])

  // ── Upload ──────────────────────────────────────────────────────────────────

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const processUpload = useCallback(async (file: File) => {
    setIsUploading(true)
    setShowLanding(false)
    setMessages([])
    setPdfFileName(file.name)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`${API}/api/upload`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (data.session_id) {
        const newSession: ChatSession = {
          id: data.session_id,
          name: file.name,
          timestamp: new Date(),
          preview: '',
        }
        setSessions(prev => [newSession, ...prev])
        setActiveSessionId(data.session_id)
        setCurrentPage(1)
        setIsSidebarOpen(true)
      }
    } catch (err) {
      console.error('Upload failed:', err)
      setShowLanding(true)
    } finally {
      setIsUploading(false)
    }
  }, [])

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') await processUpload(file)
    e.target.value = ''
  }, [processUpload])

  // ── Send message ────────────────────────────────────────────────────────────

  const handleSendMessage = useCallback(async (content: string) => {
    if (!activeSessionId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: activeSessionId, query: content, mode }),
      })
      const data = await res.json()

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        source: data.source
          ? { type: data.source as 'document' | 'web', page: data.page }
          : undefined,
        confidence: data.confidence,
      }])

      setSessions(prev =>
        prev.map(s => s.id === activeSessionId ? { ...s, preview: content.slice(0, 60) } : s)
      )
    } catch (err) {
      console.error('Chat failed:', err)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Something went wrong. Please check your connection and try again.',
      }])
    } finally {
      setIsLoading(false)
    }
  }, [activeSessionId, mode])

  const handleSuggestionClick = useCallback((suggestion: string) => {
    handleSendMessage(suggestion)
  }, [handleSendMessage])

  const handleSourceClick = useCallback((source: { type: 'document' | 'web'; page?: number }) => {
    if (source.type === 'document' && source.page) setCurrentPage(source.page)
  }, [])

  // ── Session management ──────────────────────────────────────────────────────

  const handleNewChat = useCallback(() => {
    setShowLanding(true)
    setMessages([])
    setActiveSessionId(null)
    setPdfFileName(null)
  }, [])

  const handleSelectSession = useCallback((id: string) => {
    setActiveSessionId(id)
    const session = sessions.find(s => s.id === id)
    if (session) setPdfFileName(session.name)
    setShowLanding(false)
  }, [sessions])

  const handleRenameSession = useCallback(async (id: string, name: string) => {
    try {
      await fetch(`${API}/api/sessions/${id}/rename`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      setSessions(prev => prev.map(s => s.id === id ? { ...s, name } : s))
    } catch (err) {
      console.error('Rename failed:', err)
    }
  }, [])

  const handleDeleteSession = useCallback(async (id: string) => {
    try {
      await fetch(`${API}/api/sessions/${id}`, { method: 'DELETE' })
      setSessions(prev => {
        const next = prev.filter(s => s.id !== id)
        if (activeSessionId === id) {
          setActiveSessionId(null)
          setPdfFileName(null)
          setMessages([])
          setShowLanding(true)
        }
        return next
      })
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }, [activeSessionId])

  // ── Uploading overlay ───────────────────────────────────────────────────────

  const uploadingOverlay = isUploading && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl px-8 py-6 shadow-lg text-center">
        <div className="flex gap-1 justify-center mb-3">
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
        </div>
        <p className="text-sm font-medium">Processing your document…</p>
        <p className="text-xs text-muted-foreground mt-1">Embedding chunks into ChromaDB</p>
      </div>
    </div>
  )

  // ── Landing screen ──────────────────────────────────────────────────────────

  if (showLanding) {
    return (
      <>
        {uploadingOverlay}
        <UploadLanding
          onFileSelect={processUpload}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onRenameSession={handleRenameSession}
          onDeleteSession={handleDeleteSession}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
      </>
    )
  }

  // ── Chat layout ─────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {uploadingOverlay}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onUploadClick={handleUploadClick}
      />

      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(prev => !prev)}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onRenameSession={handleRenameSession}
          onDeleteSession={handleDeleteSession}
        />

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={55} minSize={35}>
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              onSuggestionClick={handleSuggestionClick}
              onSourceClick={handleSourceClick}
              isLoading={isLoading}
              mode={mode}
              onModeChange={setMode}
            />
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border hover:bg-primary/30 transition-colors" />

          <ResizablePanel defaultSize={isPdfCollapsed ? 5 : 45} minSize={isPdfCollapsed ? 5 : 30}>
            <PDFViewer
              fileName={pdfFileName}
              currentPage={currentPage}
              totalPages={12}
              onPageChange={setCurrentPage}
              citations={[]}
              activeCitation={null}
              onCitationClick={() => {}}
              isCollapsed={isPdfCollapsed}
              onToggleCollapse={() => setIsPdfCollapsed(prev => !prev)}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <OwlMascot />
    </div>
  )
}