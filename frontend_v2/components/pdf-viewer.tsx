'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface Citation {
  page: number
  text: string
  highlight: { top: number; left: number; width: number; height: number }
}

interface PDFViewerProps {
  fileName: string | null
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  citations: Citation[]
  activeCitation: number | null
  onCitationClick: (index: number) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function PDFViewer({
  fileName,
  currentPage,
  totalPages,
  onPageChange,
  citations,
  activeCitation,
  onCitationClick,
  isCollapsed = false,
  onToggleCollapse,
}: PDFViewerProps) {
  const [zoom, setZoom] = useState(100)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50))

  // Collapsed state - show only a narrow bar with expand button
  if (isCollapsed) {
    return (
      <div className="flex flex-col h-full bg-parchment dark:bg-parchment-dark border-l border-border">
        <div className="flex items-center justify-center py-3 border-b border-border bg-card/50">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={onToggleCollapse}
            title="Expand PDF viewer"
          >
            <PanelRightOpen className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <FileText className="h-6 w-6 opacity-50" />
            <span className="text-xs [writing-mode:vertical-rl] rotate-180">{fileName || 'No document'}</span>
          </div>
        </div>
      </div>
    )
  }

  if (!fileName) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-parchment dark:bg-parchment-dark text-muted-foreground">
        <FileText className="h-16 w-16 mb-4 opacity-40" />
        <p className="font-serif text-lg">No document loaded</p>
        <p className="text-sm mt-1">Upload a PDF to start researching</p>
      </div>
    )
  }

  // Get citations for current page
  const pageCitations = citations.filter(c => c.page === currentPage)

  return (
    <div className="flex flex-col h-full bg-parchment dark:bg-parchment-dark">
      {/* PDF Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50">
        <div className="flex items-center gap-2">
          {onToggleCollapse && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={onToggleCollapse}
              title="Collapse PDF viewer"
            >
              <PanelRightClose className="h-4 w-4" />
            </Button>
          )}
          <span className="text-sm font-medium truncate max-w-[200px]">{fileName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[40px] text-center">{zoom}%</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <ScrollArea className="flex-1">
        <div 
          className="p-8"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          {/* Simulated PDF page */}
          <div className="relative bg-card mx-auto max-w-[600px] min-h-[800px] rounded-sm shadow-lg p-8">
            {/* Sample content - this would be real PDF rendering */}
            <div className="space-y-4 text-sm leading-relaxed text-foreground/90">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                The Impact of Machine Learning on Research Methodologies
              </h2>
              <p className="text-muted-foreground text-xs">
                Dr. Sarah Mitchell, Stanford University • Published March 2024
              </p>
              
              <h3 className="font-serif font-semibold mt-6">Abstract</h3>
              <p>
                This paper examines the transformative role of machine learning algorithms in modern research practices across multiple disciplines. We analyze how AI-assisted tools have changed the landscape of academic inquiry, from literature review to data analysis.
              </p>
              
              <h3 className="font-serif font-semibold mt-6">Introduction</h3>
              <p>
                The emergence of large language models has fundamentally altered how researchers approach complex problems. Traditional methods of literature synthesis, which once required weeks of manual effort, can now be augmented with AI tools that surface relevant patterns and connections.
              </p>
              <p>
                As noted by Thompson et al. (2023), &quot;The integration of machine learning into research workflows represents a paradigm shift comparable to the introduction of statistical software in the 1980s.&quot;
              </p>
              
              <h3 className="font-serif font-semibold mt-6">Methodology</h3>
              <p>
                Our study employed a mixed-methods approach, combining quantitative analysis of publication trends with qualitative interviews of active researchers. We surveyed 450 academics across 12 institutions to understand their adoption patterns of AI tools in research.
              </p>
              <p>
                Key metrics examined included time-to-publication, citation impact, and researcher satisfaction scores. Control groups were established to isolate the effects of AI assistance from other confounding variables.
              </p>
            </div>

            {/* Citation highlights */}
            {pageCitations.map((citation, idx) => (
              <button
                key={idx}
                onClick={() => onCitationClick(citations.indexOf(citation))}
                className={cn(
                  'absolute transition-colors cursor-pointer rounded-sm',
                  activeCitation === citations.indexOf(citation)
                    ? 'bg-amber/40 ring-2 ring-amber'
                    : 'bg-amber/20 hover:bg-amber/30'
                )}
                style={{
                  top: `${citation.highlight.top}%`,
                  left: `${citation.highlight.left}%`,
                  width: `${citation.highlight.width}%`,
                  height: `${citation.highlight.height}%`,
                }}
                title={citation.text}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Page Navigation */}
      <div className="flex items-center justify-center gap-4 px-4 py-3 border-t border-border bg-card/50">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Page <span className="text-foreground font-medium">{currentPage}</span> of {totalPages}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
