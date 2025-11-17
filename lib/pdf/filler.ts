import { PDFDocument } from '@cantoo/pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import type { FormData, PdfGenerationOptions } from '@/types/form'

/**
 * Default Korean font URL (NanumGothic)
 */
const DEFAULT_KOREAN_FONT_URL =
  'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/NanumGothic.woff'

/**
 * Fill PDF form with data and embed Korean font
 * @param templateBytes - Original PDF template as ArrayBuffer
 * @param formData - Form field values
 * @param options - Generation options
 * @returns Filled PDF as Uint8Array (Prisma 6 compatible)
 */
export async function fillPdfForm(
  templateBytes: ArrayBuffer,
  formData: FormData,
  options: PdfGenerationOptions = {}
): Promise<Uint8Array> {
  const {
    embedFont = true,
    fontUrl = DEFAULT_KOREAN_FONT_URL,
    flatten = false,
  } = options

  try {
    // Load PDF document
    const pdfDoc = await PDFDocument.load(templateBytes)

    // Register fontkit for custom font support
    pdfDoc.registerFontkit(fontkit)

    // Load Korean font
    let customFont
    if (embedFont) {
      try {
        const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer())
        customFont = await pdfDoc.embedFont(fontBytes)
      } catch (error) {
        console.warn('Failed to load Korean font, using default:', error)
        // Continue without custom font
      }
    }

    // Get form
    const form = pdfDoc.getForm()
    const fields = form.getFields()

    // Fill each field
    for (const field of fields) {
      const fieldName = field.getName()
      const value = formData[fieldName]

      // Skip if no value provided
      if (value === undefined || value === null) {
        continue
      }

      try {
        const fieldType = field.constructor.name

        if (fieldType === 'PDFTextField') {
          const textField = field as any
          textField.setText(String(value))

          // Apply Korean font to text field
          if (customFont) {
            textField.updateAppearances(customFont)
          }
        } else if (fieldType === 'PDFCheckBox') {
          const checkboxField = field as any
          if (value === true || value === 'true' || value === '1') {
            checkboxField.check()
          } else {
            checkboxField.uncheck()
          }
        } else if (fieldType === 'PDFRadioGroup') {
          const radioField = field as any
          radioField.select(String(value))
        } else if (fieldType === 'PDFDropdown') {
          const dropdownField = field as any
          dropdownField.select(String(value))
        }
      } catch (fieldError) {
        console.warn(`Failed to fill field ${fieldName}:`, fieldError)
        // Continue with other fields
      }
    }

    // Flatten form if requested (make fields non-editable)
    if (flatten) {
      form.flatten()
    }

    // Save as Uint8Array (Prisma 6 compatible)
    const pdfBytes = await pdfDoc.save()
    return pdfBytes
  } catch (error) {
    console.error('PDF filling error:', error)
    throw new Error(
      `Failed to fill PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Get PDF metadata (page count, file size)
 */
export async function getPdfMetadata(pdfBytes: ArrayBuffer) {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = pdfDoc.getPages()

    return {
      pageCount: pages.length,
      fileSize: pdfBytes.byteLength,
      title: pdfDoc.getTitle() || undefined,
      author: pdfDoc.getAuthor() || undefined,
    }
  } catch (error) {
    console.error('Failed to get PDF metadata:', error)
    return null
  }
}

/**
 * Convert ArrayBuffer to Uint8Array
 * Utility for Prisma 6 compatibility
 */
export function arrayBufferToUint8Array(buffer: ArrayBuffer): Uint8Array {
  return new Uint8Array(buffer)
}

/**
 * Convert Uint8Array to ArrayBuffer
 */
export function uint8ArrayToArrayBuffer(array: Uint8Array): ArrayBuffer {
  return array.buffer
}
