'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

type SourceType = 'document' | 'web'
type Mode = 'beginner' | 'technical' | 'academic'

interface Source {
  type: SourceType
  page?: number
  title?: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  source?: Source
  confidence?: number
  suggestions?: string[]
}

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  onSuggestionClick: (suggestion: string) => void
  onSourceClick?: (source: Source) => void
  isLoading?: boolean
  mode: Mode
  onModeChange: (mode: Mode) => void
}

const modeLabels: Record<Mode, string> = {
  beginner: 'Beginner',
  technical: 'Technical',
  academic: 'Academic',
}

const modeDescriptions: Record<Mode, string> = {
  beginner: 'Simple explanations',
  technical: 'Detailed technical answers',
  academic: 'Scholarly citations',
}

export function ChatInterface({
  messages,
  onSendMessage,
  onSuggestionClick,
  onSourceClick,
  isLoading,
  mode,
  onModeChange,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary opacity-60" />
              <h3 className="font-serif text-xl font-semibold mb-2">Ready to research</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Upload a document and ask questions about it, or start a conversation to explore any research topic.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[
                  'Summarize the main findings',
                  'What methodology was used?',
                  'List the key citations',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onSuggestionClick(suggestion)}
                    className="px-3 py-1.5 text-sm rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors border border-border/60 dark:border-white/15"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-lg px-4 py-3 shadow-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-card-foreground border border-border'
                  )}
                >
                  {/* Source + confidence badge for assistant messages */}
                  {message.role === 'assistant' && message.source && (
                    <button
                      onClick={() => onSourceClick?.(message.source!)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium mb-2 transition-colors',
                        message.source.type === 'document'
                          ? 'bg-primary/15 text-primary hover:bg-primary/25'
                          : 'bg-teal/20 text-teal hover:bg-teal/30'
                      )}
                    >
                      {message.source.type === 'document' ? (
                        <>📄 Document · Page {message.source.page}</>
                      ) : (
                        <>🌐 Web search</>
                      )}
                      {message.confidence !== undefined && (
                        <span className="opacity-60 ml-1">
                          · {Math.round(message.confidence * 100)}% confidence
                        </span>
                      )}
                    </button>
                  )}
                  
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Follow-up suggestions */}
                  {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSuggestionClick(suggestion)}
                          className="px-2.5 py-1 text-xs rounded-full bg-secondary/50 hover:bg-secondary text-secondary-foreground transition-colors border border-border/60 dark:border-white/15"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card rounded-lg px-4 py-3 shadow-sm border border-border">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  </div>
                  <span className="text-xs text-muted-foreground">Researching...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t border-border p-4 bg-card/30">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="relative bg-card rounded-lg border border-border shadow-sm">
              {/* Mode selector */}
              <div className="flex items-center gap-1 px-3 pt-2">
                {(Object.keys(modeLabels) as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onModeChange(m)}
                    className={cn(
                      'px-2.5 py-1 text-xs rounded-md transition-colors',
                      mode === m
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    )}
                    title={modeDescriptions[m]}
                  >
                    {modeLabels[m]}
                  </button>
                ))}
              </div>
              
              {/* Input field */}
              <div className="flex items-end gap-2 p-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about your research..."
                  className="flex-1 bg-transparent resize-none border-0 focus:ring-0 focus:outline-none text-sm min-h-[60px] max-h-[150px] p-2 text-foreground placeholder:text-muted-foreground"
                  rows={2}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="h-9 w-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Answers sourced from your document or live web search. Always verify important information.
          </p>
        </div>
      </div>
    </div>
  )
}