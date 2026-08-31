# 일정 관리 플랫폼

일정을 추가/수정/삭제할 수 있는 웹앱입니다.

## 기술 스택

- Next.js 14 (App Router) + TypeScript
- Prisma + SQLite (로컬 개발용, 필요 시 PostgreSQL 등으로 교체 가능)
- Tailwind CSS
- 비밀번호 하나로 사이트 전체를 잠그는 자체 게이트 (로그인/회원 시스템 없음)

## 시작하기

이 환경에는 Node.js가 설치되어 있지 않아 의존성 설치를 진행하지 못했습니다.
[Node.js](https://nodejs.org) (18 이상 권장) 설치 후 아래 순서로 진행하세요.

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 파일 생성
cp .env.example .env
```

`.env` 파일을 열어 두 값을 채워주세요.

- `SITE_PASSWORD` — 접속할 때 입력할 비밀번호 (원하는 값으로 직접 설정)
- `COOKIE_SECRET` — 로그인 비밀번호와 무관한, 인증 쿠키 검증용 랜덤 문자열. 아래 명령으로 생성:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
# 3. DB 마이그레이션 (SQLite 파일 및 테이블 생성)
npm run prisma:migrate -- --name init

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 접속 시 `/unlock` 페이지로 이동하며, `SITE_PASSWORD`를 입력해야 이후 화면(일정 목록/API 포함)에 접근할 수 있습니다. 인증은 브라우저 쿠키에 30일간 저장됩니다.

배포 시(Vercel 등)에는 `.env`가 아니라 호스팅 플랫폼의 환경변수 설정에 `SITE_PASSWORD`, `COOKIE_SECRET`을 등록하세요.

## 프로젝트 구조

```
schedule-manager/
├── prisma/
│   └── schema.prisma        # Schedule 모델 정의
├── src/
│   ├── middleware.ts         # 모든 요청을 가로채 인증 쿠키 확인, 없으면 /unlock으로
│   ├── app/
│   │   ├── api/
│   │   │   ├── schedules/
│   │   │   │   ├── route.ts     # GET(목록), POST(생성)
│   │   │   │   └── [id]/route.ts# GET/PATCH/DELETE(단건)
│   │   │   └── unlock/route.ts  # 비밀번호 검증 및 인증 쿠키 발급
│   │   ├── unlock/
│   │   │   ├── page.tsx
│   │   │   └── UnlockForm.tsx   # 비밀번호 입력 폼
│   │   ├── layout.tsx
│   │   ├── page.tsx         # 메인 화면 (폼 + 목록)
│   │   └── globals.css
│   ├── components/
│   │   ├── ScheduleForm.tsx
│   │   ├── ScheduleList.tsx
│   │   └── ScheduleItem.tsx
│   ├── lib/
│   │   ├── prisma.ts        # Prisma 클라이언트 싱글톤
│   │   ├── validateSchedule.ts
│   │   └── auth.ts          # 인증 쿠키 이름/유효기간 상수
│   └── types/
│       └── schedule.ts
└── .env.example
```

## 다음 단계 아이디어

- 캘린더/월간 뷰 UI (예: `date-fns` + 커스텀 그리드)
- 반복 일정, 알림/리마인더
- PostgreSQL로 전환 후 Vercel + Supabase/Neon 배포
