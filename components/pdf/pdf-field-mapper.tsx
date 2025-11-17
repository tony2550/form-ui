'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { PdfField } from '@/types/pdf'
import { Trash2, Plus } from 'lucide-react'

interface PdfFieldMapperProps {
  fields: PdfField[]
  onChange: (fields: PdfField[]) => void
}

export function PdfFieldMapper({ fields, onChange }: PdfFieldMapperProps) {
  const [editingFields, setEditingFields] = useState<PdfField[]>(fields)

  const updateField = (index: number, updates: Partial<PdfField>) => {
    const newFields = [...editingFields]
    newFields[index] = { ...newFields[index], ...updates }
    setEditingFields(newFields)
    onChange(newFields)
  }

  const removeField = (index: number) => {
    const newFields = editingFields.filter((_, i) => i !== index)
    setEditingFields(newFields)
    onChange(newFields)
  }

  const addValidationPattern = (index: number, pattern: string, message: string) => {
    updateField(index, {
      validation: { pattern, message },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">필드 매핑 ({editingFields.length}개)</h3>
        <Badge variant="secondary">
          필수: {editingFields.filter((f) => f.required).length}개
        </Badge>
      </div>

      <div className="space-y-4">
        {editingFields.map((field, index) => (
          <Card key={field.name}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    {field.name}
                    <Badge variant="outline">{field.type}</Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    PDF 필드명: {field.name}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeField(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Label */}
              <div className="space-y-2">
                <Label htmlFor={`label-${index}`}>표시 레이블 (한글)</Label>
                <Input
                  id={`label-${index}`}
                  value={field.label}
                  onChange={(e) => updateField(index, { label: e.target.value })}
                  placeholder="예: 신청자 성명"
                />
              </div>

              {/* Placeholder */}
              <div className="space-y-2">
                <Label htmlFor={`placeholder-${index}`}>
                  플레이스홀더 (선택사항)
                </Label>
                <Input
                  id={`placeholder-${index}`}
                  value={field.placeholder || ''}
                  onChange={(e) =>
                    updateField(index, { placeholder: e.target.value })
                  }
                  placeholder="예: 성명을 입력하세요"
                />
              </div>

              {/* Required */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`required-${index}`}
                  checked={field.required}
                  onCheckedChange={(checked) =>
                    updateField(index, { required: Boolean(checked) })
                  }
                />
                <Label
                  htmlFor={`required-${index}`}
                  className="font-normal cursor-pointer"
                >
                  필수 입력 항목
                </Label>
              </div>

              {/* Max Length (for text fields) */}
              {field.type === 'text' && (
                <div className="space-y-2">
                  <Label htmlFor={`maxLength-${index}`}>최대 길이</Label>
                  <Input
                    id={`maxLength-${index}`}
                    type="number"
                    value={field.maxLength || ''}
                    onChange={(e) =>
                      updateField(index, {
                        maxLength: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="예: 100"
                  />
                </div>
              )}

              {/* Options (for radio/dropdown) */}
              {(field.type === 'radio' || field.type === 'dropdown') && (
                <div className="space-y-2">
                  <Label>옵션</Label>
                  <div className="space-y-2">
                    {field.options?.map((option, optIndex) => (
                      <div key={optIndex} className="flex gap-2">
                        <Input value={option} readOnly />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newOptions = field.options?.filter(
                              (_, i) => i !== optIndex
                            )
                            updateField(index, { options: newOptions })
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation Pattern */}
              {field.type === 'text' && (
                <div className="space-y-2">
                  <Label>유효성 검사 패턴 (선택사항)</Label>
                  <Select
                    value={field.validation?.pattern || 'none'}
                    onValueChange={(value) => {
                      if (value === 'none') {
                        updateField(index, { validation: undefined })
                      } else if (value === 'email') {
                        addValidationPattern(
                          index,
                          '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                          '올바른 이메일 형식이 아닙니다'
                        )
                      } else if (value === 'phone') {
                        addValidationPattern(
                          index,
                          '^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$',
                          '올바른 전화번호 형식이 아닙니다'
                        )
                      } else if (value === 'korean_id') {
                        addValidationPattern(
                          index,
                          '^[0-9]{6}-?[0-9]{7}$',
                          '올바른 주민등록번호 형식이 아닙니다'
                        )
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="검증 패턴 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">없음</SelectItem>
                      <SelectItem value="email">이메일</SelectItem>
                      <SelectItem value="phone">전화번호</SelectItem>
                      <SelectItem value="korean_id">주민등록번호</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.validation?.message && (
                    <p className="text-xs text-muted-foreground">
                      {field.validation.message}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {editingFields.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              PDF에서 필드를 찾을 수 없습니다
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
