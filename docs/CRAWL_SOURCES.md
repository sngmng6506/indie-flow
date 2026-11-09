# 공연 정보 수집 대상 (마포구 홍대·합정 + 신촌)

기준일 2026-11-09. 인디고와 인디스트릿에 공개된 정보를 바탕으로, 무엇을 어디서 모을지 정리한다.
공연장별 인스타그램 계정과 예정 공연 수는 인디고 공연장 페이지에서 확인했다. 계정은 바뀔 수 있으니 수집 전에 한 번 더 확인한다.

## 1. 모을 정보

두 사이트가 보여주는 항목을 기준으로, 1단계 화면에 필요한 것만 모은다.

| 항목 | 인디고 | 인디스트릿 | 홍대플로우 | 주로 나오는 곳 |
| --- | --- | --- | --- | --- |
| 공연명 | ○ | ○ | 필수 | 공연장 인스타그램 게시물 |
| 날짜·시작 시간 | ○ | ○ (끝 시간 포함) | 필수 | 게시물, 예매처 |
| 입장 시간 | 칸만 있고 대부분 비어 있음 | × | 있으면 | 게시물 본문 |
| 공연장 | ○ | ○ | 필수 | 수집 대상 공연장 자체 |
| 출연진(라인업) | ○ (아티스트 페이지 연결) | ○ | 필수 | 게시물, 예매처 |
| 가격(예매·현장) | 칸만 있고 대부분 비어 있음 | 칸만 있고 대부분 비어 있음 | 필수 | 게시물 본문, 예매처 |
| 예매처·예매 링크 | 본문에 이름만(예: 29CM, 멜론티켓) | × | 필수 | 예매처, 게시물·링크트리 |
| 원본 게시물 링크 | ○ (인스타그램 게시물) | × | 필수 | 게시물 주소 |
| 포스터 | ○ (자체 서버 저장) | ○ (파일명이 `instagram_poster_...`) | 허락된 것만 (ADR-0003) | 게시물 이미지 |
| 장르 | 아티스트에만 일부 | × | 태그로 있으면 | 아티스트 소개, 운영자 입력 |
| 판매 상태(매진·현장만) | × | × | 있으면 | 예매처, 게시물 수정 |
| 공연장 주소·좌표·수용 인원 | ○ | 주소만 | 필수(좌표) | 공연장마다 한 번 입력 |

두 사이트 모두 가격과 입장 시간이 대부분 비어 있다. 이 두 칸을 채우면 일반인에게 확실한 차별점이 된다. 원본 게시물 링크(인디고)와 포스터 파일명(인디스트릿)을 보면, 두 사이트 모두 **공연장 인스타그램 게시물**을 주된 출처로 쓰는 것으로 보인다.

## 2. 어디서 모으나 (우선순위)

1. **공연장 인스타그램 게시물**: 거의 모든 공연장이 공연 공지를 여기에만 올린다. 웹사이트가 있는 곳은 아래 표의 몇 곳뿐이다.
   - 방법: Instagram Graph API의 Business Discovery로 다른 프로페셔널 계정의 게시물 목록을 조회할 수 있다(우리 쪽 프로페셔널 계정과 Meta 앱이 필요). 캡션·이미지·게시 시각까지 받을 수 있는지는 문서에서 확인하지 못했으므로 PoC로 먼저 확인한다.
   - 안 되면 반자동: 운영자가 게시물 주소를 붙여 넣으면 본문을 LLM으로 추출해 검수 큐로 보낸다.
   - 화면 스크래핑은 인스타그램 약관 문제가 있어 쓰지 않는다(멘토 상담 법률 검토 항목).
2. **공연장 웹사이트·블로그**: 벨르(velr.co.kr), 언플러그드 홍대(unplugged-hongdae.com), AOR(allofrock.co.kr), 클럽FF(네이버 블로그), 클럽 빵(링크트리). 일정 페이지가 있으면 인스타그램보다 구조가 안정적이라 먼저 쓴다.
3. **예매처**: 가격, 예매 링크, 매진 여부를 채우는 용도. 인디고 본문에 나온 29CM, 멜론티켓 외에 큰 공연장은 인터파크(NOL)·YES24·티켓링크를, 작은 공연장은 구글 폼·네이버 예약을 쓴다. 공연장 이름으로 검색해 이미 모은 공연과 맞춰 본다. 각 사이트의 robots.txt와 약관을 확인한 뒤 쓴다.
4. **아티스트 계정**: 라인업 확인과 "미리 듣기" 링크(유튜브, 멜론, 스포티파이)를 찾는 용도. 공연 일정의 주 출처로 쓰지 않는다.
5. **인디고·인디스트릿**: 수집하지 않는다. 우리 목록에서 빠진 공연장이나 공연이 있는지 사람이 가끔 비교하는 데만 쓴다.

## 3. 공연장 목록

권역은 주소 기준이다. 신촌 공연장은 대부분 **서대문구**(창천동·신촌역로)라 마포구가 아니다. 신촌을 넣을지는 표 아래에서 따로 정한다.
"예정"은 2026-11-09 기준 인디고에 올라온 예정 공연 수다. 인디스트릿은 공연장 목록이나 홈의 "이번주 공연장"에 나오면 ○로 표시했다.

### 1순위: 예정 공연 5개 이상 (먼저 수집)

| 공연장 | 권역 | 주소 | 인스타그램 | 예정 | 인디스트릿 | 메모 |
| --- | --- | --- | --- | --- | --- | --- |
| 언플러그드 라운지 | 홍대 | 마포구 와우산로29길 15 2층 | [@unplugged.lounge](https://www.instagram.com/unplugged.lounge) | 19 | ○ | |
| 무신사 개러지 | 홍대 | 마포구 잔다리로 32 지하1층 | [@musinsagarage](https://www.instagram.com/musinsagarage/) | 13 | ○ | 스탠딩 550명 |
| 우무지 | 합정 | 마포구 독막로8길 7 지하1층 | [@saveourstageskorea](https://www.instagram.com/saveourstageskorea/) | 13 | ○ | 계정 이름이 공연장 이름과 달라 확인 필요. 100석 |
| 공상온도 | 홍대(동교동) | 마포구 동교로23길 40 지하1층 | [@gongsangondo](https://www.instagram.com/gongsangondo/) | 11 | 언급만 | 80석 |
| 롤링홀 | 홍대 | 마포구 어울마당로 35 지하1층 | [@rollinghall](https://www.instagram.com/rollinghall/) | 10 | ○ | |
| 벨르 | 홍대 | 마포구 잔다리로 46 지하 | [@vel.r_live](https://www.instagram.com/vel.r_live/) | 10 | ○ | 웹사이트 velr.co.kr |
| 언플러그드 홍대 | 홍대 | 마포구 와우산로33길 26 1층 | [@unplugged_stage](https://www.instagram.com/unplugged_stage/) | 10 | ○ | 웹사이트 unplugged-hongdae.com |
| 채널1969 | 연남 | 마포구 연희로 35 | [@channel1969.seoul](https://www.instagram.com/channel1969.seoul/) | 9 | ○ | |
| 프리버드 | 홍대 | 마포구 와우산로17길 19-22 지하1층 | [@clubfreebird](https://www.instagram.com/clubfreebird/) | 7 | 언급만 | 페이스북 freebirdseoul |
| 생기스튜디오 | 홍대 | 마포구 와우산로 137 5층 | [@senggistudio](https://www.instagram.com/senggistudio/) | 6 | ○ | |
| 스트레인지프룻 | 홍대 | 마포구 와우산로29길 64 지하 | [@strangefruit.seoul](https://www.instagram.com/strangefruit.seoul/) | 6 | ○ | |
| VICTIM | 상수 | 마포구 와우산로 53 지하 | [@club_victim](https://www.instagram.com/club_victim/) | 6 | ○ | |

### 2순위: 예정 공연 1~4개

| 공연장 | 권역 | 주소 | 인스타그램 | 예정 | 인디스트릿 | 메모 |
| --- | --- | --- | --- | --- | --- | --- |
| 클럽FF | 홍대 | 마포구 와우산로17길 12 지하1층 | [@hongdaeff](https://www.instagram.com/hongdaeff/) | 4 | ○ | 네이버 블로그 clubffmanager |
| 고요의 방 | 홍대 | 마포구 와우산로29길 14-10 | [@goyoroom](https://www.instagram.com/goyoroom/) | 3 | × | |
| 우주정거장 | 홍대 | 마포구 와우산로29길 16 지하1층 | [@spacestation2017](https://www.instagram.com/spacestation2017/) | 3 | ○ | |
| AOR | 홍대 | 마포구 와우산로 156 지하1층 | [@clubaor](https://www.instagram.com/clubaor/) | 3 | ○ | 웹사이트 allofrock.co.kr |
| KT&G 상상마당 홍대 | 홍대 | 마포구 어울마당로 65 | [@ssmadang_live](https://www.instagram.com/ssmadang_live/) | 3 | ○ | 좌석 189석 / 스탠딩 400명. 예매처 판매가 많음 |
| 클럽 빵 | 홍대 | 마포구 와우산로29길 12 지하1층 | [@clubbbang](https://www.instagram.com/clubbbang/) | 2 | ○ | 링크트리 |
| 살롱문보우 | 홍대 | 마포구 잔다리로 113 (인디스트릿: 동교로12안길 36) | [@salon.moonbow](https://www.instagram.com/salon.moonbow) | 1 | ○ | 두 사이트 주소가 달라 확인 필요 |
| 스페이스한강 | 홍대(창전동) | 마포구 와우산로 128 지하1층 | [@space_hangang](https://www.instagram.com/space_hangang/) | 1 | ○ | 50석 |

### 3순위: 지금 예정 공연 없음 또는 계정 미확인 (분기마다 확인)

- 계정 확인됨, 예정 0개: 허밋 [@hermit_kr](https://www.instagram.com/hermit_kr/), 무대륙(합정) [@mudaeruk](https://www.instagram.com/mudaeruk/), 감마홀 [@gammahall.live](https://www.instagram.com/gammahall.live/)
- 확인 필요: 곱창전골(와우산로29길 8, 인디고에 계정 없음). 인디스트릿은 같은 주소를 코스모스루비(cosmosruby_)로 올려 두어, 이름이 바뀌었을 수 있다.
- 읽지 못함: 제비다방(상수, 와우산로 24). 인디고 공연장 페이지가 오류로 열리지 않았다.
- 계정 미조회(인디고에 공연장으로 등록됨): 클럽에반스, 클럽온에어, 웨스트브릿지 라이브홀, 얼라이브홀, 프리즘홀, 라이브앤라우드, 벤더, 고라니특공대, 클럽샤프(망원), 스페이스 브릭, 둘 스튜디오, 엔텐바흐, ASTRA Live, 001 클럽, 홍대 준스바, 구름아래소극장, 록집, 001 라이브홀

### 신촌 (서대문구): 넣을지 결정 필요

| 공연장 | 주소 | 인스타그램 | 예정 | 인디스트릿 |
| --- | --- | --- | --- | --- |
| 베이비돌 | 서대문구 연세로7안길 26 지하1층 | [@babydoll_seoul](https://www.instagram.com/babydoll_seoul/) | 7 | 언급만 |
| 아지토 라이브홀 | 서대문구 신촌역로 13 지하2층 | [@azito_livehall](https://www.instagram.com/azito_livehall/) | 6 | ○ |
| 인피니티클럽 | 서대문구 연세로7안길 34-3 지하 | [@1nfntclb](https://www.instagram.com/1nfntclb) | 5 | × |
| 스핀 앤 그라인드 | 서대문구 연세로12길 32 2층 | [@spinandgrind](https://www.instagram.com/spinandgrind) | 1 | × |
| 몽향, 스팀펑크락, 클럽 딥퍼플, 파생도시, 거거덩 라운지 | 서대문구 창천동·신촌역로 | 미조회 | – | × |

신촌 공연장은 홍대 중심가에서 걸어서 20분 안팎이라 "지금 걸어서 갈 수 있는" 목록에는 거의 나오지 않는다. 대신 공연 달력에서는 의미가 있다. 넣는다면 달력에만 보이게 하는 방법도 있다.

### 제외

- 대형·기관 공연장: NOL 씨어터 합정, 서강대 메리홀, 마포아트센터, 문화비축기지, CJ아지트. 인디 정기 공연이 드물고 예매처에 이미 잘 정리돼 있다. 필요하면 예매처에서만 가져온다.
- 성격이 다른 곳: 홍대 스윙홀(댄스홀).
- 권역 밖: 모래내 극락(서대문구 남가좌동).

## 4. 수집 주기

| 대상 | 주기 | 이유 |
| --- | --- | --- |
| 1순위 공연장 | 하루 2번(오전, 공연 당일 오후 4시) | 당일 변경·매진 반영 |
| 2순위 공연장 | 하루 1번 | |
| 3순위 공연장 | 주 1번 | 활동 재개 확인 |
| 예매처 가격·매진 | 하루 1번, 공연 당일은 2번 | |
| 공연 달력 범위 | 오늘부터 2주 | 달력 화면(ADR-0001) |

공연장별 마지막 수집 성공 시각을 남기고, 3일 넘게 새 게시물이 없으면 알림을 보낸다(설계 문서 "크롤러 조용한 실패").

## 출처

- [인디고 공연장 목록](https://www.indiego.co.kr/venues), [인디고 공연 상세 예시](https://www.indiego.co.kr/events/1562-%EC%97%AC%EC%A0%84%ED%9E%88-%EC%86%8C%EB%9E%80%EC%8A%A4%EB%9F%BD%EA%B2%8C-vol-03), [인디고 무신사 개러지](https://www.indiego.co.kr/venues/4-%EB%AC%B4%EC%8B%A0%EC%82%AC-%EA%B0%9C%EB%9F%AC%EC%A7%80)
- [인디스트릿 공연장 목록](https://indistreet.com/venues), [인디스트릿 홈](https://indistreet.com), [인디스트릿 공연 상세 예시](https://indistreet.com/gigs/2026-12-20-sui-sui-duck-live-in-seoul-vel.r-zhc56oz00ibqwr2h43ptqgw0)
- [Instagram Business Discovery](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery), [business_discovery 레퍼런스](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/business_discovery)
