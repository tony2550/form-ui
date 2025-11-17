import { put, del, list } from '@vercel/blob'

/**
 * Upload file to Vercel Blob storage
 * @param file - File or Uint8Array to upload
 * @param filename - Filename
 * @returns Blob URL and key
 */
export async function uploadToBlob(
  file: File | Uint8Array,
  filename: string
): Promise<{ url: string; key: string }> {
  try {
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file instanceof File ? file.type : 'application/pdf',
    })

    return {
      url: blob.url,
      key: blob.pathname,
    }
  } catch (error) {
    console.error('Blob upload error:', error)
    throw new Error(
      `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Delete file from Vercel Blob storage
 * @param key - Blob pathname to delete
 */
export async function deleteFromBlob(key: string): Promise<void> {
  try {
    await del(key)
  } catch (error) {
    console.error('Blob deletion error:', error)
    throw new Error(
      `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * List blobs with optional prefix filter
 * @param prefix - Optional prefix to filter blobs
 * @returns List of blob metadata
 */
export async function listBlobs(prefix?: string) {
  try {
    const { blobs } = await list({ prefix })
    return blobs
  } catch (error) {
    console.error('Blob listing error:', error)
    throw new Error(
      `Failed to list blobs: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Generate a safe filename
 * @param originalName - Original filename
 * @param userId - User ID for namespacing
 * @returns Safe filename
 */
export function generateSafeFilename(
  originalName: string,
  userId?: string
): string {
  // Remove special characters and spaces
  const safeName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')

  // Add timestamp
  const timestamp = Date.now()

  // Add user prefix if provided
  const prefix = userId ? `${userId}_` : ''

  return `${prefix}${timestamp}_${safeName}`
}

/**
 * Check if blob URL is valid Vercel Blob URL
 */
export function isValidBlobUrl(url: string): boolean {
  return url.includes('blob.vercel-storage.com') || url.includes('public.blob.vercel-storage.com')
}
