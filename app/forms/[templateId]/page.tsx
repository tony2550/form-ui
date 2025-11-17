'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PdfViewer } from '@/components/pdf/pdf-viewer'
import { DynamicFormField } from '@/components/forms/dynamic-form-field'
import { AutoSaveIndicator } from '@/components/forms/auto-save-indicator'
import { useFormStore } from '@/store/form-store'
import type { PdfField } from '@/types/pdf'
import type { FormData } from '@/types/form'
import { Download, ArrowLeft, FileCheck } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string | null
  fileUrl: string
  fieldSchema: PdfField[]
}

export default function FormFillingPage({
  params,
}: {
  params: Promise<{ templateId: string }>
}) {
  const router = useRouter()
  const [templateId, setTemplateId] = useState<string>('')
  const [template, setTemplate] = useState<Template | null>(null)
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    formData,
    updateField,
    setFormData,
    errors,
    setErrors,
    isSaving,
    setSaving,
    lastSaved,
    setLastSaved,
  } = useFormStore()

  // Unwrap params
  useEffect(() => {
    params.then((p) => setTemplateId(p.templateId))
  }, [params])

  // Fetch template
  useEffect(() => {
    if (!templateId) return

    const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/templates/${templateId}`)
        if (!response.ok) throw new Error('Template not found')

        const data = await response.json()
        setTemplate(data.template)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [templateId])

  // Auto-save functionality
  const saveSubmission = useCallback(async () => {
    if (!templateId || !formData || Object.keys(formData).length === 0) return

    setSaving(true)

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: submissionId,
          userId: 'demo-user', // TODO: Replace with actual user ID
          templateId,
          formData,
          status: 'DRAFT',
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      const data = await response.json()
      setSubmissionId(data.submission.id)
      setLastSaved(new Date())
    } catch (err) {
      console.error('Auto-save failed:', err)
    } finally {
      setSaving(false)
    }
  }, [templateId, formData, submissionId, setSaving, setLastSaved])

  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      saveSubmission()
    }, 2000)

    return () => clearTimeout(timer)
  }, [formData, saveSubmission])

  const handleGeneratePdf = async () => {
    if (!submissionId) {
      // Save first
      await saveSubmission()
      if (!submissionId) {
        alert('먼저 폼을 저장해주세요')
        return
      }
    }

    setGenerating(true)
    setError(null)

    try {
      const response = await fetch(`/api/submissions/${submissionId}/generate`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate PDF')
      }

      const data = await response.json()
      setGeneratedPdfUrl(data.pdfUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedPdfUrl) return

    const link = document.createElement('a')
    link.href = generatedPdfUrl
    link.download = `${template?.name || 'document'}_filled.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">로딩 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !template) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">오류: {error}</p>
            <Button onClick={() => router.back()} className="mt-4">
              돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!template) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                뒤로
              </Button>
              <div>
                <h1 className="text-xl font-bold">{template.name}</h1>
                {template.description && (
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <AutoSaveIndicator
                isSaving={isSaving}
                lastSaved={lastSaved}
                error={error}
              />

              {generatedPdfUrl ? (
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF 다운로드
                </Button>
              ) : (
                <Button
                  onClick={handleGeneratePdf}
                  disabled={generating || Object.keys(formData).length === 0}
                >
                  {generating ? (
                    <>
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <FileCheck className="h-4 w-4 mr-2" />
                      PDF 생성
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Form Fields */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>입력 폼</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {template.fieldSchema.map((field: PdfField) => (
                  <DynamicFormField
                    key={field.name}
                    field={field}
                    value={formData[field.name]}
                    onChange={(value) => updateField(field.name, value)}
                    error={errors.find((e) => e.field === field.name)?.message}
                  />
                ))}

                {template.fieldSchema.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    입력 필드가 없습니다
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Validation Errors */}
            {errors.length > 0 && (
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">
                    입력 오류 ({errors.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {errors.map((error) => (
                      <li key={error.field} className="text-destructive">
                        {error.message}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: PDF Preview */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-120px)]">
            {generatedPdfUrl ? (
              <PdfViewer
                url={generatedPdfUrl}
                title="작성 완료된 PDF"
                className="h-full"
              />
            ) : (
              <PdfViewer
                url={template.fileUrl}
                title="PDF 템플릿 미리보기"
                className="h-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
