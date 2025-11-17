import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { fillPdfForm } from '@/lib/pdf/filler'
import { uploadToBlob, generateSafeFilename } from '@/lib/storage/blob-client'
import { validateFormData } from '@/lib/pdf/validator'
import type { PdfField } from '@/types/pdf'
import type { FormData } from '@/types/form'

/**
 * POST /api/submissions/[id]/generate
 * Generate filled PDF from submission
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get submission with template
    const submission = await prisma.formSubmission.findUnique({
      where: { id },
      include: {
        template: true,
      },
    })

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Validate form data
    const fields = submission.template.fieldSchema as PdfField[]
    const formData = submission.formData as FormData
    const errors = validateFormData(formData, fields)

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400 }
      )
    }

    // Fetch template PDF
    const templateResponse = await fetch(submission.template.fileUrl)
    if (!templateResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch template PDF' },
        { status: 500 }
      )
    }

    const templateBytes = await templateResponse.arrayBuffer()

    // Fill PDF
    const filledPdfBytes = await fillPdfForm(templateBytes, formData, {
      embedFont: true,
      flatten: true, // Make fields non-editable
    })

    // Upload filled PDF
    const filename = generateSafeFilename(
      `${submission.template.name}_filled.pdf`,
      submission.userId
    )
    const { url, key } = await uploadToBlob(filledPdfBytes, filename)

    // Update submission
    const updatedSubmission = await prisma.formSubmission.update({
      where: { id },
      data: {
        completedPdfUrl: url,
        completedPdfKey: key,
        status: 'COMPLETED',
      },
    })

    return NextResponse.json({
      submission: updatedSubmission,
      pdfUrl: url,
    })
  } catch (error) {
    console.error('Failed to generate PDF:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate PDF',
      },
      { status: 500 }
    )
  }
}
