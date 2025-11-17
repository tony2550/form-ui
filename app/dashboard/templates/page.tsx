'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Upload, Trash2, Eye } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string | null
  category: string
  fieldSchema: any
  createdAt: string
  _count: {
    submissions: number
  }
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      if (!response.ok) throw new Error('Failed to fetch templates')

      const data = await response.json()
      setTemplates(data.templates)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 템플릿을 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete template')

      // Refresh list
      fetchTemplates()
    } catch (err) {
      alert('삭제 실패: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-sm text-muted-foreground">로딩 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">템플릿 관리</h1>
          <p className="text-muted-foreground">
            등록된 PDF 템플릿을 관리하고 새로운 템플릿을 추가하세요
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/templates/upload">
            <Upload className="mr-2 h-4 w-4" />
            새 템플릿 업로드
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">오류: {error}</p>
          </CardContent>
        </Card>
      )}

      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                등록된 템플릿이 없습니다
              </h3>
              <p className="text-muted-foreground mb-4">
                PDF 템플릿을 업로드하여 시작하세요
              </p>
              <Button asChild>
                <Link href="/dashboard/templates/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  템플릿 업로드
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">
                      {template.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {template.description || '설명 없음'}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{template.category}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>필드 수:</span>
                    <span className="font-medium">
                      {Array.isArray(template.fieldSchema)
                        ? template.fieldSchema.length
                        : 0}
                      개
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>제출 건수:</span>
                    <span className="font-medium">
                      {template._count.submissions}건
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>등록일:</span>
                    <span className="font-medium">
                      {new Date(template.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1" size="sm">
                    <Link href={`/forms/${template.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      폼 작성
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
