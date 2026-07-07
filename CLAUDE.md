# CLAUDE.md — K-Festival 프로젝트 가이드

## 프로젝트 개요

대한민국 문화관광축제 스케줄러. 공공데이터포털 API를 기반으로 오늘부터 7일 이내에 시작하는 축제를 카드 형태로 보여준다.

- **라이브 URL:** https://ctfschedule.qudgns200.workers.dev
- **런타임:** Cloudflare Workers (서버리스, 엣지 컴퓨팅)
- **언어:** Vanilla HTML / JavaScript (프레임워크 없음)

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| 런타임 | Cloudflare Workers |
| 정적 파일 서빙 | Cloudflare Assets 바인딩 (`ASSETS`) |
| 언어 | HTML5, Vanilla JavaScript, CSS3 |
| 폰트 | Google Fonts — Noto Sans KR, Montserrat |
| 외부 API | 공공데이터포털 전국문화축제표준데이터 |
| 배포 도구 | Wrangler CLI |

---

## 프로젝트 구조

```
├── src/
│   └── index.js              # Workers 진입점 — 라우팅, API 프록시, 정적 파일 서빙
├── functions/
│   └── api/festivals.js      # 레거시 Cloudflare Functions 엔드포인트 (현재 미사용)
├── public/
│   ├── index.html            # 메인 랜딩 페이지 (헤더 + 히어로 + iframe 래퍼)
│   └── list.html             # 축제 카드 목록 (fetch → 카드 렌더링)
├── wrangler.toml             # Cloudflare Workers 배포 설정
├── .dev.vars                 # 로컬 환경변수 (gitignore 처리됨)
├── .dev.vars.example         # 환경변수 설정 템플릿
├── API.md                    # API 요청/응답 명세서
└── HISTORY.md                # 버전별 개발 변경 이력
```

---

## 로컬 개발

### 1. 환경변수 설정

`.dev.vars.example`을 복사해 `.dev.vars`를 만들고 키를 입력한다.

```
SERVICE_KEY=여기에_공공데이터포털_서비스키_입력
```

공공데이터포털(data.go.kr)에서 **전국문화축제표준데이터** API 신청 후 발급받은 키를 사용한다.

### 2. 개발 서버 실행

```bash
wrangler dev
```

---

## 배포

```bash
wrangler deploy
```

프로덕션 환경의 `SERVICE_KEY`는 코드가 아닌 Cloudflare Workers Secret으로 등록한다.

```bash
wrangler secret put SERVICE_KEY
```

---

## 환경변수

| 변수명 | 필수 | 설명 |
|--------|:----:|------|
| `SERVICE_KEY` | Y | 공공데이터포털 API 인증키 |

---

## 라우팅 구조 (src/index.js)

| 경로 | 처리 방식 |
|------|-----------|
| `GET /api/festivals` | 공공데이터 API 7일치 호출 → 중복 제거 → 정렬 후 JSON 반환 |
| `GET /` | `public/index.html` 서빙 |
| 기타 | `public/` 디렉토리의 정적 파일 서빙 |

---

## 디자인 시스템

**Vibrant Festival 팔레트**

| 역할 | 색상 |
|------|------|
| 배경 그라디언트 | `#ff6b9d` (핑크) → `#c44dff` (퍼플) → `#4facfe` (블루) |
| 헤더 배경 | `rgba(0, 0, 0, 0.25)` + `backdrop-filter: blur(12px)` |
| 카드 상단 바 | 3색 그라디언트 (4px 높이) |
| 버튼 | `#ff6b9d` → `#c44dff` 그라디언트 |
| 카드 배경 | `#ffffff` |

---

## 주의사항 / 알려진 이슈

- **HTTP 프로토콜:** `src/index.js`의 API 호출 URL이 `http://`로 되어 있음 → `https://`로 수정 권장
- **레거시 파일:** `functions/api/festivals.js`는 현재 `src/index.js`가 모든 라우팅을 처리하므로 실제로 호출되지 않음
- **3번째 조회 버그:** 특정 조건에서 3번째 API 조회 시 오류 발생하는 미해결 이슈 있음
- **Service Key 오류 처리:** API 키가 잘못됐을 때 JSON이 아닌 문자열(`SERVICE_KEY_IS_NOT_REGISTERED_ERROR`)을 반환하므로 `res.text()` 후 파싱하는 방식으로 처리
- **iframe 고정 높이:** `800px` (모바일 `600px`) 고정 — 카드 수가 많으면 내부 스크롤로 처리됨

---

## 작업 규칙

기능 추가, 버그 수정, 디자인 변경, 보안 수정 등 유의미한 변경이 발생하면 작업 완료 후 **반드시 `HISTORY.md`를 업데이트**한다.

- 기존 버전 번호에서 하나 올려 새 섹션(`## vX.X`)을 추가할 것
- 날짜, 커밋 해시, 변경 요약, 주요 변경 파일을 포함할 것
- GitHub 푸시 전에 HISTORY.md 업데이트를 먼저 완료할 것

---

## 참고 문서

- [API.md](API.md) — API 파라미터 및 응답 필드 명세
- [HISTORY.md](HISTORY.md) — 버전별 개발 변경 이력
