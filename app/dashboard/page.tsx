import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Upload, TestTube2, PlusCircle } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">PDF AcroForm Filler</h1>
        <p className="text-muted-foreground">
          PDF 양식을 웹으로 간편하게 작성하고 자동으로 채워진 PDF를 생성하세요
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Link href="/dashboard/templates/upload">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                템플릿 업로드
              </CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+</div>
              <p className="text-xs text-muted-foreground">
                새 PDF 템플릿 추가
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/templates">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">템플릿 관리</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">등록된 템플릿</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/test">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                기능 테스트
              </CardTitle>
              <TestTube2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">✓</div>
              <p className="text-xs text-muted-foreground">
                모든 입력 타입 테스트
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">제출 현황</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">총 제출 건수</p>
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>📄 PDF 템플릿 업로드</CardTitle>
            <CardDescription>
              AcroForm이 포함된 PDF를 업로드하면 자동으로 필드를 추출합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>자동 필드 파싱</li>
              <li>필드 타입 자동 감지</li>
              <li>한글 라벨 매핑</li>
            </ul>
            <Button asChild className="mt-4 w-full">
              <Link href="/dashboard/templates/upload">템플릿 업로드</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>✍️ 웹 폼 작성</CardTitle>
            <CardDescription>
              웹 인터페이스로 편리하게 양식을 작성할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>실시간 PDF 미리보기</li>
              <li>자동 저장 (2초마다)</li>
              <li>유효성 검증</li>
            </ul>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link href="/dashboard/templates">템플릿 선택</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🇰🇷 한글 지원</CardTitle>
            <CardDescription>
              한글 입력이 완벽하게 지원되는 PDF를 생성합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>나눔고딕 폰트 자동 임베딩</li>
              <li>한글 깨짐 방지</li>
              <li>모바일 지원</li>
            </ul>
            <Badge variant="secondary" className="mt-4">
              Ready to use
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>🚀 시작하기</CardTitle>
          <CardDescription>
            PDF AcroForm Filler를 처음 사용하시나요?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li className="text-sm">
              <strong>템플릿 업로드:</strong> AcroForm이 포함된 PDF 파일을
              업로드합니다
            </li>
            <li className="text-sm">
              <strong>필드 매핑:</strong> 추출된 필드에 한글 라벨과 유효성
              규칙을 설정합니다
            </li>
            <li className="text-sm">
              <strong>폼 작성:</strong> 웹 인터페이스로 양식을 작성하고
              실시간으로 확인합니다
            </li>
            <li className="text-sm">
              <strong>PDF 생성:</strong> 작성 완료 후 한글이 포함된 PDF를
              다운로드합니다
            </li>
          </ol>

          <div className="flex gap-4 mt-6">
            <Button asChild>
              <Link href="/dashboard/templates/upload">
                <Upload className="mr-2 h-4 w-4" />
                템플릿 업로드 시작
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/test">
                <TestTube2 className="mr-2 h-4 w-4" />
                기능 테스트
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
