# 프로젝트 수정 히스토리

**프로젝트:** K-Festival — 대한민국 문화관광축제 스케줄러  
**작성자:** lee byeonghoon  
**저장소:** https://github.com/qudgns200/Cultural-Tourism-Festival-Schedule

---

## v0.1 — 초기 개발
**날짜:** 2026-03-30  
**커밋:** `787c3da`, `1ac18f9`

Python Flask 기반의 웹 서버로 프로젝트를 시작했다. 공공데이터포털 API를 호출해 축제 정보를 가져오는 로직(`dateResponse.py`, `main.py`)과 기본 HTML 템플릿(`templates/index.html`, `templates/list.html`)을 구성했다. iframe을 활용한 레이아웃과 축제 데이터 매핑도 이 시점에 완성됐다.

**주요 변경 파일**
- `main.py`, `dateResponse.py` (신규)
- `templates/index.html`, `templates/list.html` (신규)

---

## v0.2 — Cloudflare Workers 마이그레이션
**날짜:** 2026-03-30  
**커밋:** `126eb62` ~ `745d0e0`, `d621525`

로컬 Python 서버에서 Cloudflare Workers 서버리스 환경으로 전환했다. 초기에는 단일 `_worker.js`로 시도했으나 Cloudflare Functions 구조(`functions/api/festivals.js`)로 재편하고, 최종적으로 `wrangler.toml`과 `src/index.js`를 기반으로 하는 표준 Workers 구조로 확정했다. HTML 파일은 `public/` 디렉토리로 이동했으며, 모든 Python 파일은 삭제됐다.

**주요 변경 파일**
- `src/index.js`, `wrangler.toml` (신규)
- `functions/api/festivals.js` (신규)
- `public/index.html`, `public/list.html` (이동)
- `main.py`, `dateResponse.py`, `_worker.js` (삭제)

---

## v0.3 — 안정화 및 버그 수정
**날짜:** 2026-03-30  
**커밋:** `b010097`, `1eb1825`, `e708ae1`, `0cfaa73`, `255b891`, `08275a4`, `432e280`

배포 후 발생한 라우팅 문제와 API 응답 파싱 오류를 수정했다. 비(非) JSON 응답에 대한 에러 핸들링을 강화했고, Service Key 인코딩 이슈를 해결하기 위해 API 호출 로직을 단순화했다. 루트 경로(`/`) 처리와 정적 파일 라우팅도 이 단계에서 안정화됐다. 또한 중복 축제 제거 및 가나다순 정렬 기능을 추가했다.

**주요 변경 파일**
- `src/index.js`
- `public/list.html`

---

## v0.4 — UI 리디자인 (Glassmorphism + K-Festival 브랜딩)
**날짜:** 2026-03-30  
**커밋:** `2f68d41`, `2380957`, `589a5bd` ~ `0c06e95`

Variant 디자인 시스템을 적용한 후, Glassmorphism 효과와 K-Festival 브랜딩으로 대규모 UI 리디자인을 진행했다. Crimson Red(`#E11D48`) · Amber Gold(`#F59E0B`) 컬러 팔레트, 반투명 헤더, 카드 호버 애니메이션을 도입했다. 동시에 `README.md`를 최초 작성하고 프로젝트 소개, 기술 스택, 향후 개선 계획을 정리했다.

**주요 변경 파일**
- `public/index.html`, `public/list.html`
- `README.md` (신규 및 업데이트)

---

## v0.5 — 보안 업데이트
**날짜:** 2026-06-06  
**커밋:** `78cfb25`

소스 코드에 하드코딩되어 있던 공공데이터포털 Service Key를 환경변수로 분리했다. Cloudflare Workers의 Secret 기능을 통해 `SERVICE_KEY`를 주입하도록 변경했고, 로컬 개발 환경을 위한 `.dev.vars.example` 파일을 추가했다. `.gitignore`에 `.dev.vars`를 추가해 실제 키 값이 저장소에 노출되지 않도록 했다.

**주요 변경 파일**
- `src/index.js`, `functions/api/festivals.js`
- `.dev.vars.example` (신규)
- `.gitignore`

---

## v0.6 — UI 리디자인 (Vibrant Festival 스타일)
**날짜:** 2026-07-07  
**커밋:** `9b37f21`

Glassmorphism 스타일을 Vibrant Festival 스타일로 교체했다. 핑크 → 퍼플 → 블루 그라디언트 배경, 카드 상단 3색 그라디언트 바, 그라디언트 버튼 등 활기찬 축제 분위기를 연출했다. 동시에 미사용 CSS 변수, 불필요한 래퍼 태그, 중복 폰트 웨이트 등 코드를 대거 정리해 파일 크기를 줄였다 (155줄 삭제, 81줄 추가).

**주요 변경 파일**
- `public/index.html`, `public/list.html`

---

## v0.7 — 날짜 검색 기능 추가 및 문서 정비
**날짜:** 2026-07-08  
**커밋:** `2d3c122`, `e8422ce`, `f0a61b3`, `378ceeb`

날짜 선택기(달력)와 검색 버튼을 카드 목록 상단에 추가했다. 초기 로드는 기존과 동일하게 오늘 기준 7일치 축제를 보여주고, 날짜 선택 후 검색 시 해당 날짜에 진행 중인 축제(시작일 ≤ 선택일 ≤ 종료일)를 출력한다. 백엔드는 선택일 기준 30일 이전까지 병렬 호출 후 종료일 기준으로 필터링한다. 아울러 API URL을 `http://`에서 `https://`로 수정하고, 화면 메시지를 간결하게 개선했다. 프로젝트 문서(`CLAUDE.md`, `API.md`, `HISTORY.md`)도 이 시점에 최초 작성됐다.

**주요 변경 파일**
- `public/list.html` (날짜 검색 UI, 메시지 개선)
- `src/index.js` (`?date=` 파라미터 지원, https 수정, fetchDay 리팩터링)
- `CLAUDE.md` (신규 — 프로젝트 가이드 + 작업 규칙)
- `API.md` (신규 — API 명세서)
- `HISTORY.md` (신규 — 개발 변경 이력)

---

## 전체 통계

| 항목 | 내용 |
|------|------|
| 전체 커밋 수 | 28개 |
| 개발 기간 | 2026-03-30 ~ 2026-07-08 (약 3개월) |
| 주요 기술 전환 | Flask → Cloudflare Workers |
| UI 리디자인 횟수 | 2회 |
| 보안 수정 | 1회 (API 키 환경변수 분리) |
| 기능 추가 | 1회 (날짜 검색) |
