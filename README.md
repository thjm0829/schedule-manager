# 일정 관리 플랫폼

일정을 달력/목록 형태로 보여주는 정적(static) 웹앱입니다. 데이터베이스나 서버 없이, `src/data/schedules.json` 파일의 내용을 빌드 시점에 정적 HTML/JS로 구워서 보여줍니다. 별도의 로그인/비밀번호도 없습니다 — 조회 전용 사이트입니다.

## 기술 스택

- Next.js 14 (App Router, `output: "export"` 정적 내보내기) + TypeScript
- Tailwind CSS
- 데이터: `src/data/schedules.json` (정적 파일, 빌드 시 번들에 포함됨)

## 일정 데이터 수정하기

`src/data/schedules.json`을 직접 편집합니다. 각 항목의 형태는 다음과 같습니다.

```json
{
  "id": "고유 id (문자열, 아무 값이나 유일하면 됨)",
  "title": "일정 제목",
  "memo": "메모 (선택, 없으면 null)",
  "location": "장소 (선택, 없으면 null)",
  "startDate": "2026-09-01T00:00:00.000Z",
  "endDate": "2026-09-01T00:00:00.000Z",
  "allDay": true,
  "status": "예정",
  "type": "개인",
  "createdAt": "2026-08-31T00:00:00.000Z",
  "updatedAt": "2026-08-31T00:00:00.000Z"
}
```

- `status`: `예정` | `진행` | `완료`
- `type`: `약속` | `업무` | `개인` | `건강` | `중요`
- 날짜/시간은 한국 표준시(Asia/Seoul, UTC+9) 기준으로 화면에 표시됩니다 (`src/lib/timezone.ts`).
- 여러 날에 걸친 일정은 `startDate`~`endDate` 사이 모든 날짜 칸에 표시됩니다.

파일을 수정한 뒤 커밋해서 `main`/`master`에 푸시하면 GitHub Actions가 자동으로 다시 빌드해서 배포합니다.

## 로컬에서 실행하기

```bash
npm install

# 개발 서버 (핫 리로드)
npm run dev

# 정적 빌드 (out/ 디렉터리 생성)
npm run build

# 빌드 결과 미리보기
npx serve out
```

## 프로젝트 구조

```
schedule-manager/
├── .github/workflows/deploy.yml  # GitHub Pages 배포 워크플로우
├── src/
│   ├── data/
│   │   └── schedules.json   # 일정 데이터 (직접 수정)
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # 메인 화면 (캘린더 + 선택한 날짜의 일정 목록)
│   │   └── globals.css
│   ├── components/
│   │   ├── MonthCalendar.tsx
│   │   ├── ScheduleList.tsx
│   │   └── ScheduleItem.tsx
│   ├── lib/
│   │   ├── scheduleMeta.ts   # 유형/상태 라벨 및 색상 규칙
│   │   └── timezone.ts       # Asia/Seoul 기준 날짜 계산
│   └── types/
│       └── schedule.ts
└── next.config.js            # output: "export", basePath 설정
```

## GitHub Pages 배포

`.github/workflows/deploy.yml`이 `main`/`master` 브랜치에 푸시될 때마다 자동으로:

1. `npm ci` → `npm run build` (정적 export, `BASE_PATH`를 저장소 이름으로 자동 설정)
2. 빌드 결과(`out/`)를 GitHub Pages에 배포

**저장소 설정에서 한 번만** GitHub Pages 소스를 "GitHub Actions"로 지정해야 합니다: 저장소 → Settings → Pages → Build and deployment → Source → "GitHub Actions".

배포되면 `https://<사용자명>.github.io/<저장소명>/`에서 접속할 수 있습니다.
