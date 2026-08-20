# 목표 수정 API

## `POST /users/me/goal`

기존 온보딩 목표를 부분 수정하고, 수정된 원문 전체를 바탕으로 NEXT ME 문구와 테마를 다시 생성한다.

### 인증

Bearer JWT 인증이 필요하다.

```http
Authorization: Bearer <access-token>
Content-Type: application/json
```

### 요청

모든 필드는 선택 사항이지만 최소 한 개의 필드는 전달해야 한다. 전달하지 않은 필드는 가장 최근에 저장된 값을 유지한다. 문자열은 앞뒤 공백을 제거한 뒤 저장하며, 빈 문자열은 허용하지 않는다.

| 필드 | 타입 | 필수 | 제약 | 설명 |
|---|---|---:|---|---|
| `changeGoal` | string | 아니요 | `QUIT`, `REDUCE`, `UNDECIDED` | 변경할 목표 유형 |
| `nextMe` | string | 아니요 | 최대 500자, 공백 불가 | 앞으로 되고 싶은 나의 원문 |
| `motivation` | string | 아니요 | 최대 500자, 공백 불가 | 나의 동기 원문 |
| `leftMessage` | string | 아니요 | 최대 500자, 공백 불가 | 미래의 나에게 남긴 말 원문 |

```json
{
  "changeGoal": "QUIT",
  "nextMe": "러닝할 때 숨이 차서 먼저 멈추지 않는 나",
  "motivation": "체력을 되찾고 운동 기록을 늘리고 싶어요.",
  "leftMessage": "러닝도 수영도 내 체력 때문에 포기하고 싶지 않아."
}
```

### 처리 규칙

1. 요청에 포함된 원문은 기존 값과 병합한다.
2. 병합된 `nextMe`, `motivation`, `leftMessage`와 `changeGoal`을 AI 입력으로 사용한다.
3. AI가 `headline`, `start_reason`, `nextbud_theme`을 생성한다.
4. 사용자 원문과 AI 생성 결과를 구분해 `next_me_generations`에 새 이력으로 저장한다.

| DB 컬럼 | 저장값 |
|---|---|
| `user_profiles.goal_type` | 수정된 `changeGoal` |
| `next_me_generations.future_self` | 사용자 `nextMe` 원문 |
| `next_me_generations.decision_trigger` | 사용자 `motivation` 원문 |
| `next_me_generations.message_to_future_self` | 사용자 `leftMessage` 원문 |
| `next_me_generations.headline` | AI가 생성한 NEXT ME 문구 |
| `next_me_generations.start_reason` | AI가 생성한 동기 요약 |
| `next_me_generations.nextbud_theme` | 수정된 값을 바탕으로 생성·선택한 테마 |
| `next_me_generations.source` | `AI` 또는 `FALLBACK` |

### 성공 응답

`200 OK`

| 응답 필드 | 값 |
|---|---|
| `changeGoal` | 수정된 `user_profiles.goal_type` |
| `future_self` | 사용자 `nextMe` 원문. 미입력 시 기존 원문 |
| `decision_trigger` | 사용자 `motivation` 원문. 미입력 시 기존 원문 |
| `message_to_future_self` | 사용자 `leftMessage` 원문. 미입력 시 기존 원문 |
| `headline` | 수정된 값을 토대로 AI가 생성한 NEXT ME 문구 |
| `start_reason` | 수정된 값을 토대로 AI가 생성한 동기 요약 |
| `nextbud_theme` | 수정된 값을 토대로 AI가 생성·선택한 테마 |

```json
{
  "data": {
    "changeGoal": "QUIT",
    "future_self": "러닝할 때 숨이 차서 먼저 멈추지 않는 나",
    "decision_trigger": "체력을 되찾고 운동 기록을 늘리고 싶어요.",
    "message_to_future_self": "러닝도 수영도 내 체력 때문에 포기하고 싶지 않아.",
    "headline": "숨이 차도 먼저 멈추지 않는 나",
    "start_reason": "체력을 되찾고 기록을 늘리고 싶어요.",
    "nextbud_theme": "NEXTBUD_HEALTH_01"
  }
}
```

성공 응답의 `headline`, `start_reason`, `nextbud_theme`은 반드시 AI 생성 결과다. AI 호출 실패, rate limit, 네트워크 오류 또는 fallback 응답이 발생하면 새 이력을 저장하지 않고 `502 Bad Gateway`를 반환한다.

### 오류 응답

| HTTP 상태 | 상황 |
|---:|---|
| `400 Bad Request` | 수정할 필드가 없거나 문자열이 비어 있거나 길이 제한을 초과함 |
| `401 Unauthorized` | 인증 정보가 없거나 유효하지 않음 |
| `404 Not Found` | 사용자 프로필 또는 기존 NEXT ME 이력이 없음 |
| `502 Bad Gateway` | AI가 NEXT ME 생성 결과를 반환하지 못함 |
