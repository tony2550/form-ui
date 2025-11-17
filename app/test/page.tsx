'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DynamicFormField } from '@/components/forms/dynamic-form-field'
import { AutoSaveIndicator } from '@/components/forms/auto-save-indicator'
import { Badge } from '@/components/ui/badge'
import type { PdfField } from '@/types/pdf'
import { Check, X, TestTube2 } from 'lucide-react'

export default function TestPage() {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [showResults, setShowResults] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Test fields for all input types
  const testFields: PdfField[] = [
    // Text Inputs
    {
      name: 'name',
      type: 'text',
      label: '이름',
      required: true,
      placeholder: '홍길동',
    },
    {
      name: 'email',
      type: 'text',
      label: '이메일',
      required: true,
      placeholder: 'example@email.com',
      validation: {
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        message: '올바른 이메일 형식이 아닙니다',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: '전화번호',
      required: false,
      placeholder: '010-1234-5678',
      validation: {
        pattern: '^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$',
        message: '올바른 전화번호 형식이 아닙니다',
      },
    },
    {
      name: 'korean_id',
      type: 'text',
      label: '주민등록번호',
      required: false,
      placeholder: '000000-0000000',
      validation: {
        pattern: '^[0-9]{6}-?[0-9]{7}$',
        message: '올바른 주민등록번호 형식이 아닙니다',
      },
    },
    {
      name: 'short_text',
      type: 'text',
      label: '짧은 텍스트',
      required: false,
      maxLength: 50,
      placeholder: '최대 50자',
    },
    {
      name: 'long_text',
      type: 'text',
      label: '긴 텍스트 (Textarea)',
      required: false,
      maxLength: 500,
      placeholder: '최대 500자 (자동으로 textarea로 변환됨)',
    },

    // Checkbox
    {
      name: 'agree_terms',
      type: 'checkbox',
      label: '이용약관 동의',
      required: true,
      placeholder: '이용약관에 동의합니다',
    },
    {
      name: 'subscribe_newsletter',
      type: 'checkbox',
      label: '뉴스레터 구독',
      required: false,
      placeholder: '뉴스레터를 받아보시겠습니까?',
    },

    // Radio
    {
      name: 'gender',
      type: 'radio',
      label: '성별',
      required: true,
      options: ['남성', '여성', '기타'],
    },
    {
      name: 'employment_type',
      type: 'radio',
      label: '고용 형태',
      required: false,
      options: ['정규직', '계약직', '인턴', '프리랜서'],
    },

    // Dropdown
    {
      name: 'department',
      type: 'dropdown',
      label: '부서',
      required: true,
      options: ['개발팀', '디자인팀', '마케팅팀', '영업팀', '인사팀'],
    },
    {
      name: 'education',
      type: 'dropdown',
      label: '최종 학력',
      required: false,
      options: ['고등학교 졸업', '전문대 졸업', '대학교 졸업', '대학원 졸업'],
    },
  ]

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))

    // Simulate auto-save
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setLastSaved(new Date())
    }, 500)
  }

  const handleTest = () => {
    setShowResults(true)
  }

  const handleReset = () => {
    setFormData({})
    setShowResults(false)
    setLastSaved(null)
  }

  const filledFields = Object.keys(formData).filter(
    (key) => formData[key] !== null && formData[key] !== undefined && formData[key] !== ''
  )
  const requiredFields = testFields.filter((f) => f.required)
  const requiredFilled = requiredFields.filter((f) =>
    filledFields.includes(f.name)
  )

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TestTube2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">입력 타입 테스트 페이지</h1>
        </div>
        <p className="text-muted-foreground">
          모든 입력 필드 타입과 유효성 검증을 테스트할 수 있습니다
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">총 필드</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testFields.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">필수 필드</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requiredFilled.length}/{requiredFields.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">입력 완료</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filledFields.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">자동 저장</CardTitle>
          </CardHeader>
          <CardContent>
            <AutoSaveIndicator
              isSaving={isSaving}
              lastSaved={lastSaved}
              className="text-base"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Input Fields */}
        <div className="space-y-6">
          {/* Text Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>텍스트 입력</CardTitle>
              <CardDescription>
                다양한 텍스트 입력 필드와 유효성 검증
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {testFields
                .filter((f) => f.type === 'text')
                .map((field) => (
                  <DynamicFormField
                    key={field.name}
                    field={field}
                    value={formData[field.name]}
                    onChange={(value) => handleFieldChange(field.name, value)}
                  />
                ))}
            </CardContent>
          </Card>

          {/* Checkbox */}
          <Card>
            <CardHeader>
              <CardTitle>체크박스</CardTitle>
              <CardDescription>동의 항목 및 선택 옵션</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {testFields
                .filter((f) => f.type === 'checkbox')
                .map((field) => (
                  <DynamicFormField
                    key={field.name}
                    field={field}
                    value={formData[field.name]}
                    onChange={(value) => handleFieldChange(field.name, value)}
                  />
                ))}
            </CardContent>
          </Card>

          {/* Radio */}
          <Card>
            <CardHeader>
              <CardTitle>라디오 버튼</CardTitle>
              <CardDescription>단일 선택 옵션</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {testFields
                .filter((f) => f.type === 'radio')
                .map((field) => (
                  <DynamicFormField
                    key={field.name}
                    field={field}
                    value={formData[field.name]}
                    onChange={(value) => handleFieldChange(field.name, value)}
                  />
                ))}
            </CardContent>
          </Card>

          {/* Dropdown */}
          <Card>
            <CardHeader>
              <CardTitle>드롭다운</CardTitle>
              <CardDescription>선택 메뉴</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {testFields
                .filter((f) => f.type === 'dropdown')
                .map((field) => (
                  <DynamicFormField
                    key={field.name}
                    field={field}
                    value={formData[field.name]}
                    onChange={(value) => handleFieldChange(field.name, value)}
                  />
                ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Test Results */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>테스트 결과</CardTitle>
              <CardDescription>
                입력된 데이터와 필드 상태를 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={handleTest} className="flex-1">
                  테스트 실행
                </Button>
                <Button onClick={handleReset} variant="outline">
                  초기화
                </Button>
              </div>

              {showResults && (
                <div className="space-y-4">
                  {/* Field Status */}
                  <div>
                    <h3 className="font-semibold mb-2">필드 상태</h3>
                    <div className="space-y-2">
                      {testFields.map((field) => {
                        const isFilled =
                          formData[field.name] !== undefined &&
                          formData[field.name] !== null &&
                          formData[field.name] !== ''
                        const isValid = !field.validation || isFilled

                        return (
                          <div
                            key={field.name}
                            className="flex items-center justify-between text-sm p-2 rounded border"
                          >
                            <div className="flex items-center gap-2">
                              {isFilled ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <X className="h-4 w-4 text-gray-400" />
                              )}
                              <span>{field.label}</span>
                              {field.required && (
                                <Badge variant="destructive" className="text-xs">
                                  필수
                                </Badge>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {field.type}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Form Data */}
                  <div>
                    <h3 className="font-semibold mb-2">입력 데이터 (JSON)</h3>
                    <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-96">
                      {JSON.stringify(formData, null, 2)}
                    </pre>
                  </div>

                  {/* Summary */}
                  <div className="bg-muted p-4 rounded">
                    <h3 className="font-semibold mb-2">요약</h3>
                    <ul className="text-sm space-y-1">
                      <li>
                        총 필드: <strong>{testFields.length}개</strong>
                      </li>
                      <li>
                        입력 완료: <strong>{filledFields.length}개</strong>
                      </li>
                      <li>
                        필수 필드 입력:{' '}
                        <strong>
                          {requiredFilled.length}/{requiredFields.length}
                        </strong>
                      </li>
                      <li>
                        유효성 검증:{' '}
                        <strong className={requiredFilled.length === requiredFields.length ? 'text-green-600' : 'text-destructive'}>
                          {requiredFilled.length === requiredFields.length
                            ? '✓ 통과'
                            : '✗ 미완료'}
                        </strong>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Field Types Info */}
          <Card>
            <CardHeader>
              <CardTitle>지원하는 필드 타입</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="font-medium">text</span>
                  <Badge variant="outline">Input / Textarea</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="font-medium">checkbox</span>
                  <Badge variant="outline">Checkbox</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="font-medium">radio</span>
                  <Badge variant="outline">Radio Group</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="font-medium">dropdown</span>
                  <Badge variant="outline">Select</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validation Patterns */}
          <Card>
            <CardHeader>
              <CardTitle>유효성 검증 패턴</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="py-2 border-b">
                  <div className="font-medium mb-1">이메일</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{'{2,}'}$
                  </code>
                </div>
                <div className="py-2 border-b">
                  <div className="font-medium mb-1">전화번호</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    ^01[0-9]-?[0-9]{'{3,4}'}-?[0-9]{'{4}'}$
                  </code>
                </div>
                <div className="py-2">
                  <div className="font-medium mb-1">주민등록번호</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    ^[0-9]{'{6}'}-?[0-9]{'{7}'}$
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
