'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PdfFieldMapper } from '@/components/pdf/pdf-field-mapper'
import type { PdfField } from '@/types/pdf'
import { Upload, FileText, CheckCircle2 } from 'lucide-react'

export default function UploadTemplatePage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('general')
  const [fields, setFields] = useState<PdfField[]>([])
  const [step, setStep] = useState<'upload' | 'mapping' | 'uploading' | 'complete'>('upload')
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.type !== 'application/pdf') {
      setError('PDF 파일만 업로드 가능합니다')
      return
    }

    setFile(selectedFile)
    setError(null)

    // Auto-fill name from filename
    if (!name) {
      setName(selectedFile.name.replace('.pdf', ''))
    }

    // Parse PDF fields
    try {
      const arrayBuffer = await selectedFile.arrayBuffer()
      const response = await fetch('/api/templates/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: arrayBuffer,
      })

      if (response.ok) {
        const data = await response.json()
        setFields(data.fields || [])
      }
    } catch (err) {
      console.error('Failed to parse PDF:', err)
    }
  }

  const handleUpload = async () => {
    if (!file || !name) {
      setError('파일과 이름을 입력해주세요')
      return
    }

    setUploading(true)
    setStep('uploading')
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', name)
      formData.append('description', description)
      formData.append('category', category)

      const response = await fetch('/api/templates', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      setStep('complete')

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/templates')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStep('upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">템플릿 업로드</h1>
        <p className="text-muted-foreground">
          AcroForm이 포함된 PDF 파일을 업로드하여 새 템플릿을 생성하세요
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center ${
              step === 'upload' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step !== 'upload'
                  ? 'bg-primary text-primary-foreground'
                  : 'border-2 border-primary'
              }`}
            >
              {step !== 'upload' ? '✓' : '1'}
            </div>
            <span className="ml-2">파일 업로드</span>
          </div>

          <div className="w-12 h-px bg-border" />

          <div
            className={`flex items-center ${
              step === 'mapping' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'complete'
                  ? 'bg-primary text-primary-foreground'
                  : step === 'mapping'
                    ? 'border-2 border-primary'
                    : 'border-2 border-muted'
              }`}
            >
              {step === 'complete' ? '✓' : '2'}
            </div>
            <span className="ml-2">필드 매핑</span>
          </div>

          <div className="w-12 h-px bg-border" />

          <div
            className={`flex items-center ${
              step === 'complete' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'complete'
                  ? 'bg-primary text-primary-foreground'
                  : 'border-2 border-muted'
              }`}
            >
              3
            </div>
            <span className="ml-2">완료</span>
          </div>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">오류: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Upload Form */}
      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>1. PDF 파일 업로드</CardTitle>
            <CardDescription>
              AcroForm 필드가 포함된 PDF 파일을 선택하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file">PDF 파일</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                {file && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                )}
              </div>
            </div>

            {/* Template Name */}
            <div className="space-y-2">
              <Label htmlFor="name">템플릿 이름 *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 근로계약서, 입사지원서"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">설명 (선택사항)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="이 템플릿에 대한 간단한 설명을 입력하세요"
                rows={3}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">일반</SelectItem>
                  <SelectItem value="hr">인사</SelectItem>
                  <SelectItem value="contract">계약</SelectItem>
                  <SelectItem value="application">신청서</SelectItem>
                  <SelectItem value="report">보고서</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Parsed Fields Preview */}
            {fields.length > 0 && (
              <div className="space-y-2">
                <Label>추출된 필드</Label>
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-2">
                      {fields.length}개의 입력 필드가 발견되었습니다:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {fields.slice(0, 10).map((field) => (
                        <div
                          key={field.name}
                          className="text-xs bg-background px-2 py-1 rounded border"
                        >
                          {field.name}
                        </div>
                      ))}
                      {fields.length > 10 && (
                        <div className="text-xs text-muted-foreground px-2 py-1">
                          +{fields.length - 10}개 더
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => router.back()}>
                취소
              </Button>
              <Button
                onClick={() => {
                  if (fields.length > 0) {
                    setStep('mapping')
                  } else {
                    handleUpload()
                  }
                }}
                disabled={!file || !name}
              >
                {fields.length > 0 ? '다음' : '업로드'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Field Mapping */}
      {step === 'mapping' && (
        <Card>
          <CardHeader>
            <CardTitle>2. 필드 매핑 및 설정</CardTitle>
            <CardDescription>
              추출된 필드에 한글 라벨과 유효성 규칙을 설정하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <PdfFieldMapper fields={fields} onChange={setFields} />

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep('upload')}>
                이전
              </Button>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? '업로드 중...' : '템플릿 저장'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploading */}
      {step === 'uploading' && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4" />
              <h3 className="text-lg font-semibold mb-2">업로드 중...</h3>
              <p className="text-muted-foreground">
                PDF 파일을 처리하고 있습니다
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete */}
      {step === 'complete' && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">업로드 완료!</h3>
              <p className="text-muted-foreground mb-4">
                템플릿이 성공적으로 등록되었습니다
              </p>
              <p className="text-sm text-muted-foreground">
                잠시 후 템플릿 목록으로 이동합니다...
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
