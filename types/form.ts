import { SubmissionStatus } from '@prisma/client'

/**
 * Form Data
 * Key-value pairs for form field values
 */
export type FormData = Record<string, string | boolean | number | null>

/**
 * Form Validation Error
 */
export interface FormValidationError {
  field: string
  message: string
}

/**
 * Form State
 */
export interface FormState {
  formData: FormData
  isDirty: boolean
  lastSaved: Date | null
  errors: FormValidationError[]
}

/**
 * Template with Submissions
 */
export interface TemplateWithSubmissions {
  id: string
  name: string
  description: string | null
  fileUrl: string
  fieldSchema: any
  category: string
  submissions: {
    id: string
    status: SubmissionStatus
    updatedAt: Date
  }[]
}

/**
 * Submission with Template
 */
export interface SubmissionWithTemplate {
  id: string
  formData: FormData
  status: SubmissionStatus
  completedPdfUrl: string | null
  version: number
  createdAt: Date
  updatedAt: Date
  template: {
    id: string
    name: string
    fieldSchema: any
  }
}
