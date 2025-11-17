import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parsePdfFields } from '@/lib/pdf/parser'
import { uploadToBlob, generateSafeFilename } from '@/lib/storage/blob-client'

/**
 * GET /api/templates
 * List all active templates
 */
export async function GET() {
  try {
    const templates = await prisma.pdfTemplate.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        fieldSchema: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { submissions: true },
        },
      },
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Failed to fetch templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/templates
 * Create new PDF template
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const name = formData.get('name') as string
    const description = formData.get('description') as string | null
    const category = formData.get('category') as string

    if (!file || !name) {
      return NextResponse.json(
        { error: 'File and name are required' },
        { status: 400 }
      )
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      )
    }

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Parse PDF fields
    const parsingResult = await parsePdfFields(arrayBuffer)
    if (!parsingResult.success) {
      return NextResponse.json(
        { error: parsingResult.error || 'Failed to parse PDF fields' },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const filename = generateSafeFilename(file.name)
    const { url, key } = await uploadToBlob(file, filename)

    // Save to database
    const template = await prisma.pdfTemplate.create({
      data: {
        name,
        description,
        category: category || 'general',
        fileUrl: url,
        fileKey: key,
        fieldSchema: parsingResult.fields,
      },
    })

    return NextResponse.json({ template }, { status: 201 })
  } catch (error) {
    console.error('Failed to create template:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}
