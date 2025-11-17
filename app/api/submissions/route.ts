import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateFormData } from '@/lib/pdf/validator'
import type { PdfField } from '@/types/pdf'

/**
 * GET /api/submissions
 * List submissions for a user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const submissions = await prisma.formSubmission.findMany({
      where: {
        userId,
        ...(status && { status: status as any }),
      },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('Failed to fetch submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/submissions
 * Create or update submission (auto-save)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, userId, templateId, formData, status } = body

    if (!userId || !templateId) {
      return NextResponse.json(
        { error: 'userId and templateId are required' },
        { status: 400 }
      )
    }

    // Get template to validate fields
    const template = await prisma.pdfTemplate.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Validate form data if status is COMPLETED or SUBMITTED
    if (status === 'COMPLETED' || status === 'SUBMITTED') {
      const fields = template.fieldSchema as PdfField[]
      const errors = validateFormData(formData, fields)

      if (errors.length > 0) {
        return NextResponse.json(
          { error: 'Validation failed', errors },
          { status: 400 }
        )
      }
    }

    // Update existing or create new
    const submission = await prisma.formSubmission.upsert({
      where: { id: id || 'new-submission' },
      update: {
        formData,
        status: status || 'DRAFT',
        ...(status === 'SUBMITTED' && { submittedAt: new Date() }),
      },
      create: {
        userId,
        templateId,
        formData,
        status: status || 'DRAFT',
      },
    })

    return NextResponse.json({ submission })
  } catch (error) {
    console.error('Failed to save submission:', error)
    return NextResponse.json(
      { error: 'Failed to save submission' },
      { status: 500 }
    )
  }
}
