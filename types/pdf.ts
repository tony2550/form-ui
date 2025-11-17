/**
 * PDF Field Types
 * Represents different types of AcroForm fields
 */
export type PdfFieldType = 'text' | 'checkbox' | 'radio' | 'dropdown' | 'signature'

/**
 * PDF Field Validation
 */
export interface PdfFieldValidation {
  pattern?: string
  message?: string
  min?: number
  max?: number
  required?: boolean
}

/**
 * PDF Field Metadata
 * Extracted from PDF AcroForm fields
 */
export interface PdfField {
  name: string
  type: PdfFieldType
  label: string
  required: boolean
  maxLength?: number
  options?: string[]
  defaultValue?: string
  validation?: PdfFieldValidation
  placeholder?: string
}

/**
 * PDF Template Metadata
 */
export interface PdfTemplateMetadata {
  fields: PdfField[]
  totalFields: number
  requiredFields: number
  categories?: string[]
}

/**
 * PDF Generation Options
 */
export interface PdfGenerationOptions {
  embedFont?: boolean
  fontUrl?: string
  flatten?: boolean
}

/**
 * PDF Parsing Result
 */
export interface PdfParsingResult {
  success: boolean
  fields: PdfField[]
  error?: string
}
