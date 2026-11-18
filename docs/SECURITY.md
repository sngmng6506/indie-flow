# 보안 점검 및 운영 체크리스트 (2026-11-19)

## 현재 구현
- 서버에서 관리자 인증·권한 확인; 관리 API는 인증 + 동일 Origin 검증.
- 서명된 HttpOnly / SameSite=Strict 쿠키, 운영 환경 Secure 쿠키, 최대 12시간.
- 로그인은 주소별 15분 내 10회, 관객 수정 요청은 시간당 10회, 이용 로그는 시간당 120회로 PostgreSQL에서 제한한다.
- 이때 Astro Node 어댑터의 clientAddress를 사용하며, IP는 SESSION_SECRET으로 HMAC 해시한 값만 저장한다.
- 모든 SQL 입력은 postgres.js 태그로 매개변수화. 사용자 생성 텍스트는 Astro HTML 렌더링에서 escape.
- 포스터는 허용된 것만 공개, API는 승인된 공연만 반환.
- clickjacking 방지, MIME-sniff 방지, 최소 CSP, referrer 제한 적용.

## 배포 필수 확인
1. DATABASE_URL, ADMIN_PASSWORD(16자 이상), SESSION_SECRET(독립적인 무작위 32자 이상)을 Railway 웹 서비스 Variables에 등록한다.
2. HTTPS 접속, /api/health, /admin/login 및 무인증 /admin 접근 차단을 확인한다.
3. 잘못된 비밀번호 10회 반복 시 429, 정상 비밀번호 사용 시 로그인, 로그아웃 후 관리자 접근 차단을 확인한다.
4. 브라우저에서 로그인과 저장이 계속 403이면 배포 프록시의 Origin/Host 전달을 검토한다. CORS나 Origin 검사를 임의로 끄지 않는다.
5. 역방향 프록시 환경에서 clientAddress가 여러 사용자에게 동일하게 잡히면 제한이 공유될 수 있다. Railway 실제 요청 로그로 점검해야 한다.
6. PostgreSQL은 공용 인터넷에 공개하지 않고 Railway 내부 연결만 사용한다.
7. DB 백업과 복구 테스트를 설정한다.

## 알려진 한계 / 추가 조치
- 단일 공유 관리자 비밀번호만 제공한다. 여러 운영자가 생기면 계정별 권한, MFA, 감사로그가 필요하다.
- 서명 쿠키는 서버 측 개별 강제 로그아웃 기능이 없다. 유출 사고 발생 시 SESSION_SECRET을 회전하여 모든 세션을 폐기한다.
- IP 기반 요청 제한은 다수 IP를 이용한 분산 공격에 충분하지 않다. 본격 출시 시 CDN/WAF 수준의 제한이 필요하다.
- 보안 헤더는 방어 심화용 최소 정책이며, 엄격한 script-src CSP와 종합 모의침투테스트까지 마쳤다는 의미가 아니다.
- 이미지 외부 URL을 사용하면 사용자의 IP가 해당 이미지 호스트로 전달될 수 있다. 승인된 이미지 저장소 도입을 검토한다.
- DB에 쌓이는 요청 제한 카운터의 만료 데이터는 추후 정기 삭제하거나 보존기간을 정해야 한다.
