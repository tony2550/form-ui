'use client'

import { useEffect, useState } from 'react'
import { Check, CloudUpload, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/utils'

interface AutoSaveIndicatorProps {
  isSaving: boolean
  lastSaved: Date | null
  error?: string | null
  className?: string
}

export function AutoSaveIndicator({
  isSaving,
  lastSaved,
  error,
  className,
}: AutoSaveIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>('')

  useEffect(() => {
    if (!lastSaved) return

    const updateTimeAgo = () => {
      const now = new Date()
      const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000)

      if (diff < 60) {
        setTimeAgo('방금 전')
      } else if (diff < 3600) {
        setTimeAgo(`${Math.floor(diff / 60)}분 전`)
      } else if (diff < 86400) {
        setTimeAgo(`${Math.floor(diff / 3600)}시간 전`)
      } else {
        setTimeAgo(formatDateTime(lastSaved))
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [lastSaved])

  if (error) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-sm text-destructive',
          className
        )}
      >
        <AlertCircle className="h-4 w-4" />
        <span>저장 실패: {error}</span>
      </div>
    )
  }

  if (isSaving) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-sm text-muted-foreground',
          className
        )}
      >
        <CloudUpload className="h-4 w-4 animate-pulse" />
        <span>저장 중...</span>
      </div>
    )
  }

  if (lastSaved) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-sm text-muted-foreground',
          className
        )}
      >
        <Check className="h-4 w-4 text-green-600" />
        <span>저장됨 ({timeAgo})</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm text-muted-foreground',
        className
      )}
    >
      <span>저장되지 않음</span>
    </div>
  )
}
