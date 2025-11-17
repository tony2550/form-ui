import { PDFDocument } from '@cantoo/pdf-lib'
import type { PdfField, PdfParsingResult } from '@/types/pdf'

/**
 * Parse PDF AcroForm fields from a PDF file
 * @param pdfBytes - PDF file as ArrayBuffer
 * @returns Parsed field metadata
 */
export async function parsePdfFields(
  pdfBytes: ArrayBuffer
): Promise<PdfParsingResult> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()
    const fields = form.getFields()

    if (fields.length === 0) {
      return {
        success: false,
        fields: [],
        error: 'No AcroForm fields found in PDF',
      }
    }

    const parsedFields: PdfField[] = []

    for (const field of fields) {
      const fieldName = field.getName()
      const fieldType = field.constructor.name

      let type: PdfField['type'] = 'text'
      let options: string[] | undefined
      let defaultValue: string | undefined

      // Determine field type
      if (fieldType === 'PDFTextField') {
        type = 'text'
        const textField = field as any
        defaultValue = textField.getText() || undefined
      } else if (fieldType === 'PDFCheckBox') {
        type = 'checkbox'
        const checkboxField = field as any
        defaultValue = checkboxField.isChecked() ? 'true' : 'false'
      } else if (fieldType === 'PDFRadioGroup') {
        type = 'radio'
        const radioField = field as any
        options = radioField.getOptions() || []
        defaultValue = radioField.getSelected() || undefined
      } else if (fieldType === 'PDFDropdown') {
        type = 'dropdown'
        const dropdownField = field as any
        options = dropdownField.getOptions() || []
        defaultValue = dropdownField.getSelected()?.[0] || undefined
      }

      // Auto-generate label from field name
      const label = generateLabelFromFieldName(fieldName)

      parsedFields.push({
        name: fieldName,
        type,
        label,
        required: false, // Can be set later by admin
        options,
        defaultValue,
      })
    }

    return {
      success: true,
      fields: parsedFields,
    }
  } catch (error) {
    console.error('PDF parsing error:', error)
    return {
      success: false,
      fields: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Generate human-readable label from field name
 * Examples:
 * - "employee_name" -> "직원 성명"
 * - "start_date" -> "시작일"
 * - "salary" -> "급여"
 */
function generateLabelFromFieldName(fieldName: string): string {
  // Common field name mappings (Korean)
  const commonMappings: Record<string, string> = {
    name: '이름',
    employee_name: '직원 성명',
    applicant_name: '신청자 성명',
    email: '이메일',
    phone: '전화번호',
    address: '주소',
    date: '날짜',
    start_date: '시작일',
    end_date: '종료일',
    birth_date: '생년월일',
    salary: '급여',
    position: '직위',
    department: '부서',
    company: '회사명',
    signature: '서명',
    id_number: '주민등록번호',
    business_number: '사업자등록번호',
  }

  // Try exact match first
  const lowerFieldName = fieldName.toLowerCase()
  if (commonMappings[lowerFieldName]) {
    return commonMappings[lowerFieldName]
  }

  // Fallback: convert snake_case to Title Case
  return fieldName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get total and required field counts
 */
export function getFieldStats(fields: PdfField[]) {
  return {
    totalFields: fields.length,
    requiredFields: fields.filter((f) => f.required).length,
    fieldTypes: {
      text: fields.filter((f) => f.type === 'text').length,
      checkbox: fields.filter((f) => f.type === 'checkbox').length,
      radio: fields.filter((f) => f.type === 'radio').length,
      dropdown: fields.filter((f) => f.type === 'dropdown').length,
    },
  }
}
