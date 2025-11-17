# PDF AcroForm Filler

Automated PDF form filling application with Korean support. Built with Next.js 16, React 19, and modern web technologies.

## Features

- **PDF Template Upload**: Upload PDF files with AcroForm fields and automatically extract field metadata
- **Dynamic Form Generation**: Automatically generate web forms based on PDF field structure
- **Korean Font Support**: Full Korean text support with automatic font embedding
- **Auto-Save**: Automatically save form drafts every 2 seconds
- **Real-time Validation**: Client-side and server-side form validation
- **PDF Generation**: Generate filled PDFs with Korean text support
- **Cloud Storage**: Store PDFs in Vercel Blob storage

## Technology Stack

### Framework (2025 Latest Versions)
- **Next.js 16.0.3** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety

### PDF Processing
- **@cantoo/pdf-lib 2.5.3** - PDF manipulation (maintained fork)
- **@pdf-lib/fontkit 1.1.1** - Korean font embedding

### Database & Storage
- **Prisma 6.17.0** - Database ORM (PostgreSQL)
- **@vercel/blob 2.0.0** - Cloud file storage

### UI & State
- **Tailwind CSS 3.4.1** - Styling
- **shadcn/ui** - UI components (Radix UI)
- **Zustand 5.0.8** - State management
- **Zod 3.24.1** - Schema validation

## Project Structure

```
pdf-acroform-filler/
├── app/
│   ├── api/
│   │   ├── templates/          # Template management APIs
│   │   ├── submissions/        # Submission management APIs
│   │   └── upload/             # File upload API
│   ├── dashboard/              # Dashboard pages
│   ├── forms/                  # Form pages
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── pdf/                    # PDF-related components
│   ├── forms/                  # Form components
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── pdf/
│   │   ├── parser.ts          # PDF field extraction
│   │   ├── filler.ts          # PDF filling with Korean font
│   │   └── validator.ts       # Form validation
│   ├── storage/
│   │   └── blob-client.ts     # Vercel Blob client
│   ├── prisma.ts              # Prisma client
│   └── utils.ts               # Utility functions
├── store/
│   └── form-store.ts          # Zustand store
├── types/
│   ├── pdf.ts                 # PDF type definitions
│   └── form.ts                # Form type definitions
└── prisma/
    └── schema.prisma          # Database schema
```

## Getting Started

### Prerequisites

- Node.js >= 18.18.0
- npm >= 9.0.0
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pdf-acroform-filler
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/pdf_acroform"
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Set up database:
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

5. Start development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Features Explained

### 1. PDF Field Parsing

The application automatically extracts AcroForm fields from uploaded PDFs:

```typescript
// lib/pdf/parser.ts
const result = await parsePdfFields(pdfBytes)
// Returns: { success: true, fields: [...] }
```

### 2. Korean Font Support

Korean text is automatically embedded in generated PDFs:

```typescript
// lib/pdf/filler.ts
const filledPdf = await fillPdfForm(templateBytes, formData, {
  embedFont: true,  // Embed NanumGothic font
  flatten: true     // Make fields non-editable
})
```

### 3. Auto-Save

Forms automatically save every 2 seconds using Zustand:

```typescript
// store/form-store.ts
const { updateField } = useFormStore()
updateField('name', 'John Doe')
// Triggers debounced auto-save
```

### 4. Form Validation

Validation happens both client-side and server-side:

```typescript
// lib/pdf/validator.ts
const errors = validateFormData(formData, fields)
// Returns: [{ field: 'email', message: '올바른 이메일 형식이 아닙니다' }]
```

## API Endpoints

### Templates

- `GET /api/templates` - List all templates
- `POST /api/templates` - Create new template
- `GET /api/templates/[id]` - Get template by ID
- `DELETE /api/templates/[id]` - Delete template

### Submissions

- `GET /api/submissions?userId=xxx` - List user submissions
- `POST /api/submissions` - Create/update submission
- `GET /api/submissions/[id]` - Get submission by ID
- `PATCH /api/submissions/[id]` - Update submission
- `DELETE /api/submissions/[id]` - Delete submission
- `POST /api/submissions/[id]/generate` - Generate filled PDF

### Upload

- `POST /api/upload` - Upload file to Vercel Blob

## Next.js 16 Important Changes

### Async Params

All page params are now Promises in Next.js 16:

```typescript
// ❌ Old (Next.js 15)
export default function Page({ params }: { params: { id: string } }) {
  return <div>{params.id}</div>
}

// ✅ New (Next.js 16)
export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <div>{id}</div>
}
```

### Caching Changes

Next.js 16 has caching **OFF by default**:
- fetch() is uncached by default
- GET Route Handlers are uncached by default

To enable caching, use explicit revalidation:
```typescript
export const revalidate = 3600 // 1 hour
```

## Prisma 6 Important Changes

### Uint8Array for Binary Data

Prisma 6 uses `Uint8Array` instead of `Buffer`:

```typescript
// ❌ Old (Prisma 5)
const pdfBytes: Buffer = ...

// ✅ New (Prisma 6)
const pdfBytes: Uint8Array = ...
```

## Database Schema

```prisma
model User {
  id          String           @id @default(cuid())
  email       String           @unique
  name        String?
  submissions FormSubmission[]
}

model PdfTemplate {
  id          String           @id @default(cuid())
  name        String
  fileUrl     String
  fileKey     String
  fieldSchema Json
  submissions FormSubmission[]
}

model FormSubmission {
  id              String           @id @default(cuid())
  userId          String
  templateId      String
  formData        Json
  status          SubmissionStatus @default(DRAFT)
  completedPdfUrl String?
  user            User             @relation(...)
  template        PdfTemplate      @relation(...)
}

enum SubmissionStatus {
  DRAFT
  COMPLETED
  SUBMITTED
  ARCHIVED
}
```

## Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack

# Build
npm run build           # Build for production
npm start               # Start production server

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Open Prisma Studio

# Linting
npm run lint            # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `BLOB_READ_WRITE_TOKEN`
4. Deploy

### Other Platforms

Ensure Node.js >= 18.18.0 is available and set environment variables.

## Known Issues & Solutions

### Issue 1: Prisma Engine Download Fails

If `prisma generate` fails with network error:
```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```

### Issue 2: Korean Font Not Loading

Check that the font URL is accessible:
```typescript
const DEFAULT_KOREAN_FONT_URL =
  'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/NanumGothic.woff'
```

### Issue 3: Vercel Blob 4.5MB Limit

For files > 4.5MB, use client-side upload:
```typescript
import { upload } from '@vercel/blob/client'
const blob = await upload(file.name, file, {
  access: 'public',
  handleUploadUrl: '/api/upload'
})
```

## Contributing

Contributions are welcome! Please read the contributing guidelines first.

## License

MIT

## Support

For issues and questions:
- Create an issue on GitHub
- Email: support@example.com
