# API 명세서

## 개요

| 항목 | 내용 |
|------|------|
| API명 | 전국문화축제표준데이터 |
| 제공처 | 공공데이터포털 (data.go.kr) |
| 엔드포인트 | `https://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api` |
| 인증 방식 | Service Key (환경변수 `SERVICE_KEY`) |
| 응답 형식 | JSON |

---

## 요청 파라미터

| 파라미터 | 타입 | 필수 | 설명 | 고정값 / 예시 |
|----------|------|:----:|------|---------------|
| `serviceKey` | String | Y | 인증키 — 환경변수 `SERVICE_KEY`에서 주입 | — |
| `pageNo` | Number | Y | 페이지 번호 | `1` |
| `numOfRows` | Number | Y | 한 페이지 결과 수 | `100` |
| `type` | String | Y | 응답 형식 | `JSON` |
| `fstvlStartDate` | String | Y | 축제 시작일 (YYYY-MM-DD) | `2026-07-07` |

### 요청 예시

```
GET https://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api
  ?serviceKey=YOUR_SERVICE_KEY
  &pageNo=1
  &numOfRows=100
  &type=JSON
  &fstvlStartDate=2026-07-07
```

---

## 응답 구조

```
response
└── body
    └── items[]       ← 축제 목록 배열
        ├── fstvlNm
        ├── opar
        ├── fstvlStartDate
        ├── fstvlEndDate
        └── homepageUrl
```

### 응답 필드

| 필드명 | 타입 | 설명 | UI 사용 위치 |
|--------|------|------|--------------|
| `fstvlNm` | String | 축제명 | 카드 제목 표시, 중복 제거 기준 키 |
| `opar` | String | 개최 장소 | 📍 아이콘과 함께 카드 장소 정보 표시 |
| `fstvlStartDate` | String | 축제 시작일 (YYYY-MM-DD) | 날짜 범위 배지 (`시작일 ~ 종료일`) |
| `fstvlEndDate` | String | 축제 종료일 (YYYY-MM-DD) | 날짜 범위 배지 (`시작일 ~ 종료일`) |
| `homepageUrl` | String | 공식 홈페이지 URL | 홈페이지 방문 버튼 (없으면 버튼 비활성화) |

---

## 데이터 처리 로직

| 단계 | 내용 |
|------|------|
| 호출 횟수 | 오늘부터 7일간 매일 1회씩 총 7번 호출 |
| 중복 제거 | `fstvlNm` 기준으로 동일 축제 중복 항목 제거 |
| 정렬 | 축제명 기준 가나다순 정렬 (`localeCompare`) |
| 오류 처리 | `SERVICE_KEY_IS_NOT_REGISTERED_ERROR` 응답은 무시하고 스킵 |

---

## 응답 헤더 (서버 → 클라이언트)

| 헤더 | 값 |
|------|----|
| `Content-Type` | `application/json` |
| `Access-Control-Allow-Origin` | `*` |
| `Cache-Control` | `no-cache` |

---

## 관련 파일

| 파일 | 역할 |
|------|------|
| `src/index.js` | Cloudflare Workers 메인 라우터 — API 호출, 중복 제거, 정렬 처리 |
| `functions/api/festivals.js` | Cloudflare Functions API 엔드포인트 |
| `public/list.html` | 응답 데이터 렌더링 (카드 UI) |
| `.dev.vars` | 로컬 개발용 환경변수 파일 (gitignore 처리) |
| `.dev.vars.example` | 환경변수 설정 예시 템플릿 |
