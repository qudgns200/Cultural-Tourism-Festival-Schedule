---

# 📌 Cultural Tourism Festival Schedule

대한민국의 다양한 문화·관광 축제를 한눈에 확인할 수 있는 웹 서비스입니다.
공공데이터(한국관광공사 API)를 기반으로 축제 정보를 제공하며, 사용자 친화적인 UI를 통해 쉽게 탐색할 수 있도록 설계되었습니다.

🔗 **Live Demo**
👉 [https://ctfschedule.qudgns200.workers.dev](https://ctfschedule.qudgns200.workers.dev)

---

## 📖 프로젝트 소개

Cultural Tourism Festival Schedule은
**오늘 날짜 기준으로 일주일 안의 시작**하는 축제를 보여줍니다.

공공데이터를 활용하여 사용자에게 최신 축제 정보를 제공하고,
직관적인 인터페이스로 빠르게 원하는 정보를 찾을 수 있도록 구현했습니다.

---

## 💻 사용기술

- 언어 : HTML, javaScript
- 배포 : Cloudflare Workers
- API : 공공데이터포털 전국문화축제표준데이터

---

## 🖇️ 프로젝트 구조 요약
📦 Cultural-Tourism-Festival-Schedule
├── 📁 functions/api/   ← API 프록시 (API 키 보호)
├── 📁 public/          ← 정적 파일 (HTML, CSS, JS)
├── 📁 src/
│   └── index.js        ← Cloudflare Workers 진입점
├── wrangler.toml       ← Cloudflare 배포 설정
└── .gitignore
