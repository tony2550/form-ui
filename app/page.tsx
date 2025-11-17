import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, FileText, Zap, Globe } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            PDF AcroForm Filler
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            PDF 양식을 웹으로 간편하게 작성하고 자동으로 채워진 PDF를 생성하세요
            <br />
            한글 입력이 완벽하게 지원됩니다
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/dashboard">
                시작하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/test">
                기능 테스트
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 mb-2 text-blue-600" />
              <CardTitle>자동 필드 추출</CardTitle>
              <CardDescription>
                PDF 파일을 업로드하면 AcroForm 필드를 자동으로 인식하고 웹 폼으로 변환합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 텍스트, 체크박스, 라디오, 드롭다운 지원</li>
                <li>• 필드 타입 자동 감지</li>
                <li>• 유효성 검증 규칙 설정</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 mb-2 text-purple-600" />
              <CardTitle>실시간 미리보기</CardTitle>
              <CardDescription>
                입력한 내용이 실시간으로 PDF에 반영되는 것을 확인할 수 있습니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 2초마다 자동 저장</li>
                <li>• 실시간 유효성 검증</li>
                <li>• 작업 중단 후 이어서 작성</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="h-10 w-10 mb-2 text-green-600" />
              <CardTitle>한글 완벽 지원</CardTitle>
              <CardDescription>
                한글 폰트를 자동으로 임베딩하여 깨짐 없는 PDF를 생성합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 나눔고딕 폰트 자동 임베딩</li>
                <li>• 모든 한글 입력 지원</li>
                <li>• 클라우드 스토리지 저장</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle>최신 기술 스택 (2025년 11월)</CardTitle>
            <CardDescription>
              차세대 웹 기술로 구축된 안정적이고 빠른 애플리케이션
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">프레임워크</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Next.js 16.0.3 (App Router)</li>
                  <li>• React 19.2.0</li>
                  <li>• TypeScript 5.9.3</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">PDF 처리</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• @cantoo/pdf-lib 2.5.3</li>
                  <li>• fontkit (한글 폰트 지원)</li>
                  <li>• Vercel Blob Storage</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">UI/UX</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Tailwind CSS 3.4.1</li>
                  <li>• shadcn/ui (Radix UI)</li>
                  <li>• Zustand 5.0.8</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">데이터베이스</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Prisma 6.17.0</li>
                  <li>• PostgreSQL</li>
                  <li>• Zod Validation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-muted-foreground mb-8">
            몇 분 안에 첫 PDF 양식을 작성할 수 있습니다
          </p>
          <Button asChild size="lg">
            <Link href="/dashboard">
              대시보드로 이동
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
