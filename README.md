# K-Festival — 대한민국 문화관광축제 스케줄러

대한민국 전국에서 열리는 문화·관광 축제를 한눈에 확인할 수 있는 웹 서비스입니다.  
공공데이터포털 API를 기반으로 실시간 축제 정보를 제공하며, 날짜 검색으로 원하는 날의 축제를 빠르게 찾을 수 있습니다.

🔗 **Live Demo** → [https://ctfschedule.qudgns200.workers.dev](https://ctfschedule.qudgns200.workers.dev)

---

## 주요 기능

- **실시간 축제 조회** — 오늘부터 7일 이내에 시작하는 축제를 자동으로 불러옵니다.
- **날짜 검색** — 날짜를 선택하면 해당 날짜에 진행 중인 축제(시작일 ≤ 선택일 ≤ 종료일)를 조회합니다.
- **축제 카드 UI** — 축제명, 개최 장소, 기간, 공식 홈페이지 링크를 카드 형태로 표시합니다.
- **반응형 디자인** — 모바일과 데스크톱 모두 최적화된 레이아웃을 제공합니다.

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| 런타임 | Cloudflare Workers |
| 언어 | HTML5, Vanilla JavaScript, CSS3 |
| 배포 | Wrangler CLI |
| 데이터 | 공공데이터포털 전국문화축제표준데이터 |
| 폰트 | Google Fonts (Noto Sans KR, Montserrat) |

---

## 프로젝트 구조

```
📦 Cultural-Tourism-Festival-Schedule
├── 📁 src/
│   └── index.js          ← Cloudflare Workers 진입점 (라우팅 · API 프록시)
├── 📁 public/
│   ├── index.html        ← 메인 페이지 (히어로 · 검색 · 카드 목록)
│   └── list.html         ← 축제 카드 렌더링 (fetch → UI)
├── 📁 functions/api/
│   └── festivals.js      ← Cloudflare Functions 엔드포인트 (레거시)
├── wrangler.toml         ← Cloudflare 배포 설정
├── .dev.vars.example     ← 환경변수 설정 예시
├── API.md                ← API 명세서
└── HISTORY.md            ← 버전별 변경 이력
```

---

## 로컬 실행

### 1. 환경변수 설정

```bash
# .dev.vars.example을 복사해 .dev.vars 생성
SERVICE_KEY=여기에_공공데이터포털_서비스키_입력
```

> 공공데이터포털(data.go.kr)에서 **전국문화축제표준데이터** API를 신청하면 발급받을 수 있습니다.

### 2. 개발 서버 실행

```bash
wrangler dev
```

---

## 배포

```bash
# 프로덕션 API 키 등록
wrangler secret put SERVICE_KEY

# 배포
wrangler deploy
```

---

## API

외부 API 파라미터 및 응답 필드에 대한 상세 명세는 [API.md](API.md)를 참고하세요.

| 엔드포인트 | 설명 |
|------------|------|
| `GET /api/festivals` | 오늘부터 7일치 축제 조회 |
| `GET /api/festivals?date=YYYY-MM-DD` | 특정 날짜에 진행 중인 축제 조회 |

---

## 개발 이력

버전별 상세 변경 내역은 [HISTORY.md](HISTORY.md)를 참고하세요.

| 버전 | 내용 |
|------|------|
| v0.1 | Flask 기반 초기 개발 |
| v0.2 | Cloudflare Workers 마이그레이션 |
| v0.3 | 라우팅·에러 핸들링 안정화 |
| v0.4 | Glassmorphism UI 리디자인 |
| v0.5 | API 키 환경변수 분리 (보안) |
| v0.6 | Vibrant Festival 스타일 리디자인 |
| v0.7 | 날짜 검색 기능 추가 |
