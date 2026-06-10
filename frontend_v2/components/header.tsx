'use client'

import { Sun, Moon, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  isDarkMode: boolean
  onToggleTheme: () => void
  onUploadClick: () => void
}

export function Header({ isDarkMode, onToggleTheme, onUploadClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
          {/* Open book icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path
              d="M2 6C2 6 4 5 7 5C9.5 5 11 6 12 7C13 6 14.5 5 17 5C20 5 22 6 22 6V19C22 19 20 18 17 18C14.5 18 13 19 12 20C11 19 9.5 18 7 18C4 18 2 19 2 19V6Z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 7V20"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="font-serif text-xl font-semibold tracking-tight">ResearchFlow</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onUploadClick}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload PDF</span>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleTheme}
          className="h-9 w-9"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  )
}