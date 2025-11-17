import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { deleteFromBlob } from '@/lib/storage/blob-client'

/**
 * GET /api/submissions/[id]
 * Get submission by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const submission = await prisma.formSubmission.findUnique({
      where: { id },
      include: {
        template: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ submission })
  } catch (error) {
    console.error('Failed to fetch submission:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/submissions/[id]
 * Update submission
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { formData, status } = body

    const submission = await prisma.formSubmission.update({
      where: { id },
      data: {
        ...(formData && { formData }),
        ...(status && {
          status,
          ...(status === 'SUBMITTED' && { submittedAt: new Date() }),
        }),
      },
    })

    return NextResponse.json({ submission })
  } catch (error) {
    console.error('Failed to update submission:', error)
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/submissions/[id]
 * Delete submission
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const submission = await prisma.formSubmission.findUnique({
      where: { id },
    })

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Delete completed PDF if exists
    if (submission.completedPdfKey) {
      try {
        await deleteFromBlob(submission.completedPdfKey)
      } catch (error) {
        console.warn('Failed to delete completed PDF:', error)
      }
    }

    await prisma.formSubmission.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete submission:', error)
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    )
  }
}
