# 인디플로우 (Indie Flow)

홍대·합정·상수·연남·망원·신촌 인근의 인디 공연을 날짜와 거리로 찾는 모바일 웹 서비스. 검색·SNS 유입을 먼저 검증하고 카페 QR은 추후 도입합니다.

## 구현 범위
- 공연 목록/상세, 날짜 띠, 예상 도보 거리, 네이버 지도/예매 링크
- 관리자 로그인, 공연장·공연 등록/수정/공개 승인, 관객 정보 수정 요청
- PostgreSQL 저장, 공개 REST API, 기본 SEO 및 익명 행동 로그
- **제외:** Instagram API, LLM API, 자동 수집, 외부 인증, QR 기능

## 로컬 실행
Node.js 22 이상 및 PostgreSQL이 필요합니다.

```bash
npm install
cp .env.example .env
# .env: DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET, PUBLIC_SITE_URL 설정
set -a && source .env && set +a
npm run db:migrate
npm run dev
```

Windows PowerShell에서는 `.env` 내용을 환경변수로 설정하거나 실행 도구를 사용하세요.

```bash
npm run check
npm test
npm run build
```

데모 데이터는 자동으로 공개하지 않습니다. `/admin/login`에서 로그인한 뒤 공연장을 먼저 등록하고 공연을 직접 추가하세요.

## Railway 배포
1. GitHub 저장소를 Railway 신규 서비스로 연결합니다.
2. PostgreSQL 서비스를 추가합니다.
3. 웹 서비스 변수에 `DATABASE_URL=${{Postgres.DATABASE_URL}}`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `PUBLIC_SITE_URL`을 설정합니다. 참조 변수의 서비스명은 실제 Railway 서비스 이름에 맞추세요.
4. `railway.json`에 명시된 build/start 명령과 `/api/health` 확인을 사용합니다.
5. Railway 도메인을 발급받고 `PUBLIC_SITE_URL`을 해당 https 주소로 설정합니다.

비밀값을 Git에 올리지 마세요. 스키마 변경 전 DB 백업을 권장합니다.

- 설계 결정: [docs/ADR.md](docs/ADR.md)
- API 계약: [docs/API.md](docs/API.md)
- 시스템 구성: [ARCHITECTURE.md](ARCHITECTURE.md)
- 디자인: [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)
- 개발 원칙: [AGENTS.md](AGENTS.md)
