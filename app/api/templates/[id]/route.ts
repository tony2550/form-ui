import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { deleteFromBlob } from '@/lib/storage/blob-client'

/**
 * GET /api/templates/[id]
 * Get template by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const template = await prisma.pdfTemplate.findUnique({
      where: { id },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    })

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Failed to fetch template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/templates/[id]
 * Delete template
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const template = await prisma.pdfTemplate.findUnique({
      where: { id },
    })

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Delete from Blob storage
    try {
      await deleteFromBlob(template.fileKey)
    } catch (error) {
      console.warn('Failed to delete blob:', error)
      // Continue with database deletion
    }

    // Delete from database (cascade will delete submissions)
    await prisma.pdfTemplate.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete template:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
