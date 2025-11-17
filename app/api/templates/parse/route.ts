import { NextRequest, NextResponse } from 'next/server'
import { parsePdfFields } from '@/lib/pdf/parser'

/**
 * POST /api/templates/parse
 * Parse PDF fields without creating a template
 * Used for previewing fields before upload
 */
export async function POST(request: NextRequest) {
  try {
    const arrayBuffer = await request.arrayBuffer()

    if (arrayBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: 'Empty file provided' },
        { status: 400 }
      )
    }

    // Parse PDF fields
    const parsingResult = await parsePdfFields(arrayBuffer)

    if (!parsingResult.success) {
      return NextResponse.json(
        { error: parsingResult.error || 'Failed to parse PDF fields' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      fields: parsingResult.fields,
      count: parsingResult.fields.length,
    })
  } catch (error) {
    console.error('Failed to parse PDF:', error)
    return NextResponse.json(
      { error: 'Failed to parse PDF' },
      { status: 500 }
    )
  }
}
