'use client'

import { useRef, useState, useCallback } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Header } from '@/components/header'
import { ChatSidebar } from '@/components/chat-sidebar'

interface ChatSession {
  id: string
  name: string
  timestamp: Date 
  preview: string
}

interface UploadLandingProps {
  onFileSelect: (file: File) => void
  sessions: ChatSession[]
  activeSessionId: string | null
  onSelectSession: (id: string) => void
  onRenameSession: (id: string, name: string) => void
  onDeleteSession: (id: string) => void
  isDarkMode: boolean
  onToggleTheme: () => void
}

export function UploadLanding({
  onFileSelect,
  sessions,
  activeSessionId,
  onSelectSession,
  onRenameSession,
  onDeleteSession,
  isDarkMode,
  onToggleTheme,
}: UploadLandingProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (file.type === 'application/pdf') onFileSelect(file)
  }, [onFileSelect])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Header — gives theme toggle + consistent look with chat layout */}
      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        onUploadClick={() => fileInputRef.current?.click()}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for resuming past sessions */}
        <ChatSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(prev => !prev)}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={onSelectSession}
          onNewChat={() => setIsSidebarOpen(false)} // already on landing
          onRenameSession={onRenameSession}
          onDeleteSession={onDeleteSession}
        />

        {/* Main content — centered */}
        <div className="flex flex-col items-center justify-center flex-1 px-6">
          <div className="w-full max-w-md text-center">

            <h2 className="font-serif text-3xl font-semibold mb-3">
              Start researching
            </h2>
            <p className="text-muted-foreground mb-10">
              Upload a PDF to get cited answers
              {sessions.length > 0 && (
                <>, or{' '}
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
                  >
                    resume a past session
                  </button>
                </>
              )}
              .
            </p>

            {/* Drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200',
                'flex flex-col items-center justify-center gap-4 py-14 px-8',
                isDragging
                  ? 'border-primary bg-primary/10 scale-[1.02]'
                  : 'border-border hover:border-primary/50 hover:bg-card/80 bg-card/40'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-14 h-14 rounded-full transition-colors',
                isDragging ? 'bg-primary/20' : 'bg-secondary'
              )}>
                <Upload className={cn(
                  'h-6 w-6 transition-colors',
                  isDragging ? 'text-primary' : 'text-muted-foreground'
                )} />
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">
                  {isDragging ? 'Drop it here' : 'Drop your PDF here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or{' '}
                  <span className="text-primary underline underline-offset-2">
                    browse your files
                  </span>
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleInputChange}
              className="hidden"
            />

            {/* Feature hints */}
            <div className="flex items-center justify-center gap-6 mt-8 text-xs text-muted-foreground">
              <span>Cited page answers</span>
              <span>·</span>
              <span>Web search fallback</span>
              <span>·</span>
              <span>Confidence scoring</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}