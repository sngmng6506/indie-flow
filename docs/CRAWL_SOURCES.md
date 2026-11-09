# 공연 정보 수집 대상 (홍대·합정·신촌 일대)

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
2. **공연장 웹사이트·블로그**: 벨르(velr.co.kr), 언플러그드 홍대(unplugged-hongdae.com), AOR(allofrock.co.kr), 스페이스 브릭(spacebrickkorea.com), ASTRA Live(astralive.kr), 클럽FF(네이버 블로그), 클럽 빵(링크트리). 일정 페이지가 있으면 인스타그램보다 구조가 안정적이라 먼저 쓴다.
3. **예매처**: 가격, 예매 링크, 매진 여부를 채우는 용도. 인디고 본문에 나온 29CM, 멜론티켓 외에 큰 공연장은 인터파크(NOL)·YES24·티켓링크를, 작은 공연장은 구글 폼·네이버 예약을 쓴다. 공연장 이름으로 검색해 이미 모은 공연과 맞춰 본다. 각 사이트의 robots.txt와 약관을 확인한 뒤 쓴다.
4. **아티스트 계정**: 라인업 확인과 "미리 듣기" 링크(유튜브, 멜론, 스포티파이)를 찾는 용도. 공연 일정의 주 출처로 쓰지 않는다.
5. **인디고·인디스트릿**: 수집하지 않는다. 우리 목록에서 빠진 공연장이나 공연이 있는지 사람이 가끔 비교하는 데만 쓴다.

## 3. 공연장 목록

공연이 열리는 곳은 거의 모두 넣는다. 빼는 것은 DJ 위주 나이트클럽과 연극·코미디 소극장뿐이다.
행정구역(구)으로 나누지 않고 홍대·합정·상수·연남·망원·신촌 일대를 한 권역으로 본다. 권역 칸은 동네 이름이다.
"예정"은 2026-11-09 기준 인디고에 올라온 예정 공연 수, "지난"은 인디고에 쌓인 지난 공연 수다. 인디스트릿은 공연장 목록이나 홈의 "이번주 공연장"에 나오면 ○로 표시했다.
총 69곳: 1순위 16, 2순위 20, 3순위 18, 지도에서 찾은 곳 13, 위치 확인 필요 2.

### 1순위: 예정 공연 5개 이상 (16곳, 하루 2번 수집)

| 공연장 | 권역 | 주소 | 인스타그램 | 예정 | 인디스트릿 | 메모 |
| --- | --- | --- | --- | --- | --- | --- |
| 언플러그드 라운지 | 홍대 | 와우산로29길 15 2층 | [@unplugged.lounge](https://www.instagram.com/unplugged.lounge) | 19 | ○ | 공연 카페 |
| 무신사 개러지 | 홍대 | 잔다리로 32 지하1층 | [@musinsagarage](https://www.instagram.com/musinsagarage/) | 13 | ○ | 스탠딩 550명 |
| 우무지 | 합정 | 독막로8길 7 지하1층 | [@saveourstageskorea](https://www.instagram.com/saveourstageskorea/) | 13 | ○ | 계정 이름이 공연장 이름과 달라 확인 필요. 100석 |
| 공상온도 | 홍대(동교동) | 동교로23길 40 지하1층 | [@gongsangondo](https://www.instagram.com/gongsangondo/) | 11 | 언급만 | 80석 |
| 롤링홀 | 홍대 | 어울마당로 35 지하1층 | [@rollinghall](https://www.instagram.com/rollinghall/) | 10 | ○ | |
| 벨르 | 홍대 | 잔다리로 46 지하 | [@vel.r_live](https://www.instagram.com/vel.r_live/) | 10 | ○ | 웹사이트 velr.co.kr. 지도에는 같은 주소에 "벨로주 홍대"가 있어 같은 곳인지 확인 |
| 언플러그드 홍대 | 홍대 | 와우산로33길 26 1층 | [@unplugged_stage](https://www.instagram.com/unplugged_stage/) | 10 | ○ | 웹사이트 unplugged-hongdae.com |
| 채널1969 | 연남 | 연희로 35 지하1층 | [@channel1969.seoul](https://www.instagram.com/channel1969.seoul/) | 9 | ○ | 공연 없는 날은 DJ 펍 |
| 베이비돌 | 신촌 | 연세로7안길 26 지하1층 | [@babydoll_seoul](https://www.instagram.com/babydoll_seoul/) | 7 | 언급만 | |
| 프리버드 | 홍대 | 와우산로17길 19-22 지하1층 | [@clubfreebird](https://www.instagram.com/clubfreebird/) | 7 | 언급만 | 지도 리뷰에 "컨벤트 펍으로 바뀌었다"는 말이 있어 확인 필요 |
| 생기스튜디오 | 홍대 | 와우산로 137 5층 | [@senggistudio](https://www.instagram.com/senggistudio/) | 6 | ○ | |
| 스트레인지프룻 | 홍대 | 와우산로29길 64 지하 | [@strangefruit.seoul](https://www.instagram.com/strangefruit.seoul/) | 6 | ○ | |
| 아지토 라이브홀 | 신촌 | 신촌역로 13 지하2층 | [@azito_livehall](https://www.instagram.com/azito_livehall/) | 6 | ○ | |
| VICTIM | 상수 | 와우산로 53 지하 | [@club_victim](https://www.instagram.com/club_victim/) | 6 | ○ | 지도에는 "Club Victim"으로 등록돼 한글 검색에 안 걸림 |
| 인피니티클럽 | 신촌 | 연세로7안길 34-3 지하 | [@1nfntclb](https://www.instagram.com/1nfntclb) | 5 | × | |
| 클럽샤프 | 망원 | 동교로 63 지하1층 | [@club_sharp](https://www.instagram.com/club_sharp/) | 5 | × | 지난 공연 36개 |

### 2순위: 예정 공연 1~4개 (20곳, 하루 1번 수집)

| 공연장 | 권역 | 주소 | 인스타그램 | 예정 | 인디스트릿 | 메모 |
| --- | --- | --- | --- | --- | --- | --- |
| 클럽FF | 홍대 | 와우산로17길 12 지하1층 | [@hongdaeff](https://www.instagram.com/hongdaeff/) | 4 | ○ | 네이버 블로그 clubffmanager |
| 록집 | 홍대 | 양화로6길 103 2층 | [@rock._.zip](https://www.instagram.com/rock._.zip) | 4 | × | |
| 고요의 방 | 홍대 | 와우산로29길 14-10 | [@goyoroom](https://www.instagram.com/goyoroom/) | 3 | × | |
| 우주정거장 | 홍대 | 와우산로29길 16 지하1층 | [@spacestation2017](https://www.instagram.com/spacestation2017/) | 3 | ○ | |
| AOR | 홍대 | 와우산로 156 지하1층 | [@clubaor](https://www.instagram.com/clubaor/) | 3 | ○ | 웹사이트 allofrock.co.kr |
| KT&G 상상마당 홍대 | 홍대 | 어울마당로 65 | [@ssmadang_live](https://www.instagram.com/ssmadang_live/) | 3 | ○ | 좌석 189석 / 스탠딩 400명. 예매처 판매가 많음 |
| 클럽 빵 | 홍대 | 와우산로29길 12 지하1층 | [@clubbbang](https://www.instagram.com/clubbbang/) | 2 | ○ | 링크트리 |
| 라이브앤라우드 | 홍대(동교동) | 동교로 191 지하2층 | [@liveandloud_music_company](https://www.instagram.com/liveandloud_music_company/) | 2 | × | |
| 벤더 | 상수 | 와우산로14길 4 지하1층 | [@bender_hongdae](https://www.instagram.com/bender_hongdae/) | 2 | × | 지난 공연 21개 |
| 클럽 딥퍼플 | 신촌 | 연세로7안길 34-6 | [@club_deep_purple](https://www.instagram.com/club_deep_purple) | 2 | × | 지난 공연 10개 |
| 살롱문보우 | 홍대 | 잔다리로 113 (인디스트릿: 동교로12안길 36) | [@salon.moonbow](https://www.instagram.com/salon.moonbow) | 1 | ○ | 두 사이트 주소가 달라 확인 필요 |
| 스페이스한강 | 홍대(창전동) | 와우산로 128 지하1층 | [@space_hangang](https://www.instagram.com/space_hangang/) | 1 | ○ | 50석 |
| 스핀 앤 그라인드 | 신촌 | 연세로12길 32 2층 | [@spinandgrind](https://www.instagram.com/spinandgrind) | 1 | × | |
| 클럽 에반스 | 홍대 | 와우산로 63 2층 | [@jazzclub_evans](https://www.instagram.com/jazzclub_evans/) | 1 | × | 재즈 클럽. 실제로는 매일 공연, 인스타그램에 일정 공지 |
| 프리즘홀 | 홍대 | 양화로12길 6 | [@prismhall](https://www.instagram.com/prismhall/) | 1 | × | |
| 001 라이브홀 | 망원 | 월드컵로 140 지하1층 | [@001_livehall](https://www.instagram.com/001_livehall/) | 1 | × | |
| 파생도시 | 신촌 | 연세로11길 12 지하1층 | [@haseitoshi.zip](https://www.instagram.com/haseitoshi.zip) | 1 | × | |
| 거거덩 라운지 | 신촌 | 신촌역로 22-5 3층 | [@ggdcoop](https://www.instagram.com/ggdcoop) | 1 | × | |
| 라디오가가 | 합정(서교동) | 양화로11길 54 | 없음 | 1 | × | 인스타그램 직접 확인 필요 |
| 긱 라이브하우스 | 신촌 | 연세로5길 26-17 지하 | 없음 | 1 | × | 스탠딩 30~40명. 인스타그램 직접 확인 필요 |

### 3순위: 지금 예정 공연 없음 (18곳, 주 1번 수집)

지난 공연이 있거나 지도에서 운영 중으로 확인된 곳이다. 새 공연이 올라오면 2순위로 올린다.

| 공연장 | 권역 | 인스타그램 | 지난 | 메모 |
| --- | --- | --- | --- | --- |
| 제비다방 | 상수 | [@jebidabang](https://www.instagram.com/jebidabang/) | 24 | 지도에서 운영 확인. 공연 카페 |
| 클럽온에어 | 홍대 | [@club_onair](https://www.instagram.com/club_onair/) | 5 | |
| 웨스트브릿지 라이브홀 | 홍대 | 없음 | 2 | 지도에서 운영 확인. 인스타그램 직접 확인 필요 |
| 얼라이브홀 | 합정(서교동) | [@alivehall](https://www.instagram.com/alivehall/) | 1 | |
| 고라니특공대 | 상수 | [@gorani_raiders](https://www.instagram.com/gorani_raiders/) | 3 | |
| 스페이스 브릭 | 홍대 | [@spacebrickkorea](https://www.instagram.com/spacebrickkorea/) | 3 | 웹사이트 spacebrickkorea.com |
| 둘 스튜디오 | 홍대 | [@dule_studio](https://www.instagram.com/dule_studio) | 1 | |
| 엔텐바흐 | 홍대(동교동) | [@studio_entenbach](https://www.instagram.com/studio_entenbach/) | 1 | |
| ASTRA Live | 홍대(동교동) | 없음 | 1 | 웹사이트 astralive.kr |
| 001 클럽 | 홍대 | [@001_club](https://www.instagram.com/001_club) | 1 | |
| 홍대 준스바 | 홍대 | [@joons_official](https://www.instagram.com/joons_official) | – | |
| 구름아래소극장 | 홍대 | [@gurumare_theater](https://www.instagram.com/gurumare_theater/) | 3 | 음악 공연 위주 소극장 |
| 몽향 | 신촌 | [@studio_monghyang](https://www.instagram.com/studio_monghyang/) | – | 대관 공연이 많음 |
| 스팀펑크락 | 신촌 | [@stimpunkrock_livepub](https://www.instagram.com/stimpunkrock_livepub/) | 3 | |
| 허밋 | 홍대 | [@hermit_kr](https://www.instagram.com/hermit_kr/) | – | |
| 무대륙 | 합정 | [@mudaeruk](https://www.instagram.com/mudaeruk/) | – | 공연 카페 |
| 감마홀 | 홍대 | [@gammahall.live](https://www.instagram.com/gammahall.live/) | – | |
| 곱창전골 / 코스모스루비 | 홍대 | 인스타그램 cosmosruby_ (인디스트릿 기준) | – | 같은 주소(와우산로29길 8)라 이름이 바뀌었을 수 있음 |

### 인디고에 없는 곳 (지도 검색으로 추가, 13곳)

인스타그램 계정은 웹 검색으로 찾지 못해, 수집 시작 전에 직접 확인한다. 공연 수가 확인되기 전까지는 3순위로 다룬다.

| 공연장 | 권역 | 주소 | 종류 | 메모 |
| --- | --- | --- | --- | --- |
| 드림홀 | 합정 | 양화로 64 | 라이브 공연장 | 대관 공연이 많음 |
| 컨벤트 펍 | 홍대 | 와우산로17길 15 | 라이브 펍 | 프리버드와 같은 곳인지 확인 |
| 재머스 | 홍대 | 상세 주소 확인 필요 | 라이브 클럽 | 최근 리뷰상 정기 공연이 줄어든 것으로 보임 |
| 복스 셀러 (Vox Cellar) | 홍대 | 어울마당로 43 지하1층 | 라이브 바 | 금·토 |
| 롤링스톤즈 | 홍대(동교동) | 동교동 185-1 | 록 라이브 바 | |
| 아로아로홀 | 합정 | 월드컵로 41-1 지하1층 | 라이브홀 | 지하 아이돌·애니송 공연 위주 |
| 카페공캠 | 홍대(서교동) | 잔다리로 111 지하1층 | 카페 | 가끔 어쿠스틱 공연 |
| 벨로주 망원 | 망원 | 포은로 117 4층 | 어쿠스틱 공연장 | 좌석형 소규모 공연 |
| 뉴올 재즈라운지 | 연남(동교동) | 동교로23길 14 | 재즈바 | 입장료 있음 |
| 연남5701 | 연남 | 연남동 570-1 | 재즈바 | 목~일, 입장료 있음 |
| SEOB's | 연남(성산동) | 성산동 3-24 | 재즈 피아노 바 | 주인이 직접 연주 |
| 러스틱재즈 | 망원 | 망원로 74 | 재즈바 | 금~일 |
| 블루버드 | 신촌 | 창천동 52-93 | 재즈바 | |

재즈바는 매일 같은 시간에 고정 공연을 하는 곳이 많아 공지 방식이 클럽과 다르다(주간 편성표 한 장). 처음 가는 사람에게 문턱이 낮은 편이라 "처음 가기 좋음" 후보로 함께 수집한다.

### 위치 확인 필요 (2곳)

인디고에 공연장으로 등록돼 있지만 주소와 계정이 없다: 홍대 R1 스테이지, 스페이스 홍. 공연 게시물이 다시 나오면 위치를 확인해 넣는다.

### 공연장을 계속 찾는 방법

이 목록도 전부는 아니다. 아래 방법으로 운영하면서 늘린다.

- 수집한 공연 게시물에 태그되거나 언급된 공연장 중 목록에 없는 곳을 검수 큐에 따로 모은다.
- 출연 팀 계정의 공연 공지에 나온 공연장을 같은 방식으로 모은다.
- 공연장 등록 신청(설계 문서 "등록·권한 구조")으로 들어오는 곳을 더한다.
- 분기마다 지도 검색과 인디고·인디스트릿 공연장 목록을 다시 비교한다.

### 제외

- 대형·기관 공연장: NOL 씨어터 합정, 서강대 메리홀, 마포아트센터, 문화비축기지, CJ아지트. 인디 정기 공연이 드물고 예매처에 이미 잘 정리돼 있다. 필요하면 예매처에서만 가져온다.
- 성격이 다른 곳: 홍대 스윙홀(댄스홀), DJ 위주 나이트클럽(클럽 사보타지, NB 등), LP 카페·음악 감상 바처럼 공연이 없는 곳, 연극·코미디 소극장(산울림, 별빛소극장, 김대범소극장, K-POP STAGE).
- 권역 밖: 모래내 극락(남가좌동). 홍대·신촌에서 멀다.

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
