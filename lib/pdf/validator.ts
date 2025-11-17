import type { PdfField } from '@/types/pdf'
import type { FormData, FormValidationError } from '@/types/form'

/**
 * Validate form data against field schema
 * @param formData - User input data
 * @param fields - PDF field schema
 * @returns Validation errors (empty if valid)
 */
export function validateFormData(
  formData: FormData,
  fields: PdfField[]
): FormValidationError[] {
  const errors: FormValidationError[] = []

  for (const field of fields) {
    const value = formData[field.name]

    // Check required fields
    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field: field.name,
        message: `${field.label}은(는) 필수 항목입니다`,
      })
      continue
    }

    // Skip validation if field is empty and not required
    if (value === undefined || value === null || value === '') {
      continue
    }

    // Validate by field type
    switch (field.type) {
      case 'text':
        validateTextField(field, value, errors)
        break
      case 'checkbox':
        validateCheckboxField(field, value, errors)
        break
      case 'radio':
      case 'dropdown':
        validateOptionsField(field, value, errors)
        break
    }

    // Custom validation pattern
    if (field.validation?.pattern) {
      try {
        const regex = new RegExp(field.validation.pattern)
        if (!regex.test(String(value))) {
          errors.push({
            field: field.name,
            message:
              field.validation.message ||
              `${field.label}의 형식이 올바르지 않습니다`,
          })
        }
      } catch (error) {
        console.warn(`Invalid regex pattern for field ${field.name}`)
      }
    }
  }

  return errors
}

/**
 * Validate text field
 */
function validateTextField(
  field: PdfField,
  value: any,
  errors: FormValidationError[]
) {
  const strValue = String(value)

  // Max length validation
  if (field.maxLength && strValue.length > field.maxLength) {
    errors.push({
      field: field.name,
      message: `${field.label}은(는) 최대 ${field.maxLength}자까지 입력 가능합니다`,
    })
  }

  // Min/Max validation
  if (field.validation?.min !== undefined) {
    const numValue = Number(strValue)
    if (!isNaN(numValue) && numValue < field.validation.min) {
      errors.push({
        field: field.name,
        message: `${field.label}은(는) ${field.validation.min} 이상이어야 합니다`,
      })
    }
  }

  if (field.validation?.max !== undefined) {
    const numValue = Number(strValue)
    if (!isNaN(numValue) && numValue > field.validation.max) {
      errors.push({
        field: field.name,
        message: `${field.label}은(는) ${field.validation.max} 이하여야 합니다`,
      })
    }
  }
}

/**
 * Validate checkbox field
 */
function validateCheckboxField(
  field: PdfField,
  value: any,
  errors: FormValidationError[]
) {
  if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
    errors.push({
      field: field.name,
      message: `${field.label}은(는) 체크박스 형식이어야 합니다`,
    })
  }
}

/**
 * Validate radio/dropdown field
 */
function validateOptionsField(
  field: PdfField,
  value: any,
  errors: FormValidationError[]
) {
  if (field.options && !field.options.includes(String(value))) {
    errors.push({
      field: field.name,
      message: `${field.label}의 값이 유효하지 않습니다`,
    })
  }
}

/**
 * Common validation patterns
 */
export const ValidationPatterns = {
  email: {
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    message: '올바른 이메일 형식이 아닙니다',
  },
  phone: {
    pattern: '^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$',
    message: '올바른 전화번호 형식이 아닙니다',
  },
  koreanIdNumber: {
    pattern: '^[0-9]{6}-?[0-9]{7}$',
    message: '올바른 주민등록번호 형식이 아닙니다',
  },
  businessNumber: {
    pattern: '^[0-9]{3}-?[0-9]{2}-?[0-9]{5}$',
    message: '올바른 사업자등록번호 형식이 아닙니다',
  },
  koreanPostalCode: {
    pattern: '^[0-9]{5}$',
    message: '올바른 우편번호 형식이 아닙니다',
  },
}
