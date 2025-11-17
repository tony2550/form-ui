'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { PdfField } from '@/types/pdf'
import { cn } from '@/lib/utils'

interface DynamicFormFieldProps {
  field: PdfField
  value: string | boolean | number | null | undefined
  onChange: (value: string | boolean | number) => void
  error?: string
  disabled?: boolean
  className?: string
}

export function DynamicFormField({
  field,
  value,
  onChange,
  error,
  disabled = false,
  className,
}: DynamicFormFieldProps) {
  const fieldId = `field-${field.name}`

  const renderField = () => {
    switch (field.type) {
      case 'text':
        // Check if it should be a textarea based on maxLength
        if (field.maxLength && field.maxLength > 200) {
          return (
            <Textarea
              id={fieldId}
              value={String(value || '')}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || `${field.label} 입력`}
              maxLength={field.maxLength}
              disabled={disabled}
              className={cn(error && 'border-destructive')}
            />
          )
        }

        return (
          <Input
            id={fieldId}
            type={getInputType(field.name)}
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || `${field.label} 입력`}
            maxLength={field.maxLength}
            disabled={disabled}
            className={cn(error && 'border-destructive')}
          />
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldId}
              checked={Boolean(value)}
              onCheckedChange={(checked) => onChange(checked)}
              disabled={disabled}
            />
            <label
              htmlFor={fieldId}
              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.placeholder || '동의합니다'}
            </label>
          </div>
        )

      case 'radio':
        if (!field.options || field.options.length === 0) {
          return <p className="text-sm text-muted-foreground">옵션 없음</p>
        }

        return (
          <div className="space-y-2">
            {field.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${fieldId}-${option}`}
                  name={fieldId}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={disabled}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-2 focus:ring-ring"
                />
                <label
                  htmlFor={`${fieldId}-${option}`}
                  className="text-sm font-normal"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        )

      case 'dropdown':
        if (!field.options || field.options.length === 0) {
          return <p className="text-sm text-muted-foreground">옵션 없음</p>
        }

        return (
          <Select
            value={String(value || '')}
            onValueChange={(val) => onChange(val)}
            disabled={disabled}
          >
            <SelectTrigger
              id={fieldId}
              className={cn(error && 'border-destructive')}
            >
              <SelectValue placeholder={`${field.label} 선택`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      default:
        return (
          <Input
            id={fieldId}
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          />
        )
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={fieldId} className="flex items-center gap-1">
        {field.label}
        {field.required && <span className="text-destructive">*</span>}
        {field.maxLength && (
          <span className="text-xs text-muted-foreground ml-auto">
            {String(value || '').length}/{field.maxLength}
          </span>
        )}
      </Label>

      {renderField()}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {field.validation?.message && !error && (
        <p className="text-xs text-muted-foreground">
          {field.validation.message}
        </p>
      )}
    </div>
  )
}

/**
 * Determine HTML input type based on field name
 */
function getInputType(fieldName: string): string {
  const lowerName = fieldName.toLowerCase()

  if (lowerName.includes('email')) return 'email'
  if (lowerName.includes('phone') || lowerName.includes('tel')) return 'tel'
  if (lowerName.includes('date')) return 'date'
  if (lowerName.includes('time')) return 'time'
  if (lowerName.includes('number') || lowerName.includes('age') || lowerName.includes('salary')) return 'number'
  if (lowerName.includes('url') || lowerName.includes('website')) return 'url'

  return 'text'
}
