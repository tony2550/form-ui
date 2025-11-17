import { NextRequest, NextResponse } from 'next/server'
import { uploadToBlob, generateSafeFilename } from '@/lib/storage/blob-client'

/**
 * POST /api/upload
 * Upload file to Vercel Blob (for client-side uploads)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Generate safe filename
    const filename = generateSafeFilename(file.name, userId)

    // Upload to Blob
    const { url, key } = await uploadToBlob(file, filename)

    return NextResponse.json({ url, key })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
