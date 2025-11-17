'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Download, Maximize2 } from 'lucide-react'

interface PdfViewerProps {
  url: string
  title?: string
  className?: string
}

export function PdfViewer({ url, title = 'PDF Preview', className }: PdfViewerProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Validate URL
    if (!url) {
      setError('PDF URL이 제공되지 않았습니다')
      setLoading(false)
      return
    }

    // Check if URL is accessible
    fetch(url, { method: 'HEAD' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('PDF를 불러올 수 없습니다')
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [url])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = url
    link.download = title || 'document.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFullscreen = () => {
    window.open(url, '_blank')
  }

  if (error) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-center h-full min-h-[400px] p-6">
          <div className="text-center">
            <p className="text-destructive mb-2">PDF 로드 실패</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <div className="border-b p-4 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            title="다운로드"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFullscreen}
            title="새 창에서 열기"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative w-full h-full min-h-[600px] bg-gray-50">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-sm text-muted-foreground">
                PDF 로딩 중...
              </p>
            </div>
          </div>
        )}

        <iframe
          src={`${url}#toolbar=0`}
          className="w-full h-full min-h-[600px]"
          title={title}
          onLoad={() => setLoading(false)}
        />
      </div>
    </Card>
  )
}

/**
 * PDF Viewer with page navigation
 * For more advanced features, you can integrate pdf.js
 */
export function AdvancedPdfViewer({ url, title }: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  return (
    <Card>
      <div className="border-b p-4 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <iframe
          src={`${url}#page=${currentPage}&toolbar=0`}
          className="w-full h-[600px]"
          title={title}
        />
      </div>
    </Card>
  )
}
