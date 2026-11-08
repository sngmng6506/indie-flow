# 홍대플로우 API 명세 (초안)

1단계 화면 세 개에 필요한 API만 적는다. 구현과 함께 갱신한다. 모든 오류는 같은 형식으로 돌려준다.

```json
{"error": {"code": "ERROR_CODE", "message": "사용자에게 보여줄 안내"}}
```

공통 규칙: 시간은 서울 시간 기준 ISO 8601(`2026-11-08T20:00:00+09:00`), 가격은 원 단위 정수, 값이 없으면 `null`.

## GET /api/events

오늘 근처 공연 목록을 시작 시간 순으로 돌려준다. 4시간 안에 시작하는 공연이 먼저, 그 안에서는 처음 가기 좋은 공연, 그다음 가까운 순이다.

### 요청 (쿼리)

| 필드 | 형식 | 필수 | 설명 |
| --- | --- | --- | --- |
| `when` | `now` / `tonight` / `weekend` | 아니요 | 기본 `now` (지금 갈 수 있는 공연) |
| `cafe` | string | 아니요 | QR의 카페 코드. 있으면 그 카페 기준 거리와 정렬 |
| `lat`, `lng` | number | 아니요 | 카페 코드가 없을 때 쓰는 기준 좌표 |

### 성공

- HTTP 상태: `200 OK`

```json
{
  "checkedAt": "2026-11-08T19:40:00+09:00",
  "events": [
    {
      "id": "evt_123",
      "startsAt": "2026-11-08T20:00:00+09:00",
      "title": "달빛정거장 단독공연",
      "venue": {"id": "ven_12", "name": "작은방 라이브홀"},
      "walkMinutes": 4,
      "summary": "기타 한 대로 부르는 잔잔한 노래",
      "firstTimerFriendly": true,
      "doorPrice": 25000,
      "poster": {"url": "https://.../poster.webp", "alt": "달빛정거장 단독공연 · 작은방 라이브홀 포스터"}
    }
  ]
}
```

`poster`는 사용이 허락된 포스터만 담고, 아니면 `null`이다. `walkMinutes`는 직선거리 추정값이다.

### 오류

| HTTP 상태 | 코드 | 상황 |
| --- | --- | --- |
| `400 Bad Request` | `INVALID_WHEN` | `when`이 허용 값이 아님 |
| `400 Bad Request` | `INVALID_LOCATION` | 좌표 범위가 홍대 서비스 지역을 벗어남 |
| `404 Not Found` | `CAFE_NOT_FOUND` | 카페 코드가 없음 |

## GET /api/events/{id}

공연 상세를 돌려준다.

### 성공

- HTTP 상태: `200 OK`

```json
{
  "id": "evt_123",
  "startsAt": "2026-11-08T20:00:00+09:00",
  "doorsOpenAt": "2026-11-08T19:30:00+09:00",
  "title": "달빛정거장 단독공연",
  "venue": {"id": "ven_12", "name": "작은방 라이브홀", "address": "[도로명 주소] 지하 1층", "lat": 37.0, "lng": 126.0},
  "firstTimerFriendly": true,
  "doorPrice": 25000,
  "advancePrice": 22000,
  "ticketUrl": "https://...",
  "lineup": [{"name": "달빛정거장", "summary": "...", "previewUrl": "https://..."}],
  "poster": null,
  "checkedAt": "2026-11-08T19:40:00+09:00"
}
```

### 오류

| HTTP 상태 | 코드 | 상황 |
| --- | --- | --- |
| `404 Not Found` | `EVENT_NOT_FOUND` | 공연이 없거나 비공개 |

## POST /api/events/{id}/edit-requests

"정보가 다르면 알려주세요"로 들어온 수정요청을 저장한다. 로그인이 필요 없다.

### 요청

| 필드 | 형식 | 필수 | 설명 |
| --- | --- | --- | --- |
| `field` | `time` / `price` / `place` / `canceled` / `other` | 예 | 어떤 정보가 다른지 |
| `note` | string (최대 300자) | 아니요 | 설명 |

```json
{"field": "time", "note": "20시가 아니라 20시 30분 시작이래요"}
```

### 성공

- HTTP 상태: `201 Created`

```json
{"id": "req_45"}
```

### 오류

| HTTP 상태 | 코드 | 상황 |
| --- | --- | --- |
| `400 Bad Request` | `INVALID_FIELD` | `field`가 허용 값이 아님 |
| `400 Bad Request` | `NOTE_TOO_LONG` | `note`가 300자를 넘음 |
| `404 Not Found` | `EVENT_NOT_FOUND` | 공연이 없음 |
| `429 Too Many Requests` | `RATE_LIMITED` | 같은 세션에서 짧은 시간에 너무 많이 보냄 |

## POST /api/log

화면 이용 기록을 저장한다. 이름, 연락처 같은 개인정보는 받지 않는다. 익명 세션 번호만 쓴다.

### 요청

| 필드 | 형식 | 필수 | 설명 |
| --- | --- | --- | --- |
| `type` | `scan` / `list_view` / `detail_view` / `ticket_click` / `route_click` / `preview_click` / `survey` | 예 | 이벤트 종류 |
| `cafe` | string | 아니요 | QR 카페 코드 |
| `placement` | string | 아니요 | QR 부착 위치 코드 |
| `eventId` | string | 아니요 | 관련 공연 |
| `value` | string | 아니요 | 설문 답(`first` / `sometimes` / `often`), 선택한 지도(`naver` / `kakao` / `copy`) |

```json
{"type": "survey", "cafe": "c_03", "value": "first"}
```

익명 세션 번호는 서버가 쿠키로 발급한다. 요청 본문에 넣지 않는다.

### 성공

- HTTP 상태: `204 No Content`

### 오류

| HTTP 상태 | 코드 | 상황 |
| --- | --- | --- |
| `400 Bad Request` | `INVALID_TYPE` | `type`이 허용 값이 아님 |
| `400 Bad Request` | `INVALID_VALUE` | `value`가 해당 `type`의 허용 값이 아님 |

기록 실패는 화면 동작에 영향을 주지 않는다. 클라이언트는 실패해도 재시도하지 않는다.

## 관리자 API (등록·검수)

별도 문서로 정리한다. 모든 요청은 서버에서 로그인과 권한을 확인한다. 공연장 계정은 자기 공연장의 정보만 고칠 수 있고, 검수 큐와 승인 기능은 운영자만 쓸 수 있다.
