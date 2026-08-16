# NEXT TIME 진행 인수인계

## 폴더 구조 컨벤션
- 페이지: `src/pages/` (도메인별 하위 폴더, 예: `next-time/`, `settings/`)
- 도메인 컴포넌트: `src/components/{도메인}/` (예: `next-time/`, `pattern/`, `home/`)
- 공통 컴포넌트: `src/components/common/`
- Context: `src/contexts/`
- Mock 데이터: `src/data/`
- 에셋: `src/assets/`
- 라우터: `src/router.jsx` (경로는 kebab-case, 예: `/next-time`)

## 스타일링 방식
- styled-components + `theme` (`src/constants/theme.js`, ThemeProvider in `main.jsx`)
- rem 단위, `theme.colors.*` 토큰 사용 (primary `#00D579`, gray `#68686D`, bg0 `#FEFEFE` 등)
- import 순서: react → 외부 라이브러리 → 내부 모듈 → 에셋 → styled 하단 정의

## 공통 컴포넌트 (`src/components/next-time/`)

### Header.jsx
- props: `{ title, subtitle?, onBack }` — 다크 테마 상단 네비, statusbar + 뒤로가기 + 타이틀
- statusbar.svg 포함, NEXT TIME / NEXT ME 타이틀용

### ProgressBar.jsx
- props: `{ percentage }` — 4px 트랙, primary fill, 0~100 클램프

### OptionCard.jsx
- props: `{ label, mood?, selected?, onClick }` — 마스코트+라벨 카드형 선택지, selected 시 primary border
- MascotCharacter 내부 사용, 카드 높이 10.75rem

### OptionChip.jsx
- props: `{ label, selected?, onClick, fullWidth? }` — 텍스트 칩, selected 시 primary border

### OptionGrid.jsx
- props: `{ options, variant?, layout?, selectedValue, onChange }` — variant `card|chip`, layout `grid-3|grid-2|list`
- 단일 선택 라디오 형태, card는 2열 그리드

### MascotCharacter.jsx
- props: `{ mood, size?, alt? }` — mood: `neutral|craving|urgent|run|success`, size: `sm|md|lg`
- `src/assets/mascot-{mood}.svg` 매핑

### PrimaryButton.jsx
- props: `{ children, onClick?, type?, disabled?, variant? }` — variant `primary|secondary|ghost`
- disabled: 반투명 배경 + 흐린 텍스트, primary: green CTA (기존 `common/PrimaryButton`과 별도)

### WhyThisBox.jsx
- props: `{ text }` — "💡 왜 이 행동일까요?" 고정 타이틀 + 본문, 접기 없음

### CircularTimer.jsx
- props: `{ totalSeconds, remainingSeconds, showRemainingLabel? }` — SVG 원형 게이지, MM:SS 표시
- 카운트다운 로직 없음 (Mission 페이지에서 연결 예정)

### TextAreaField.jsx
- props: `{ value, onChange, placeholder?, rows?, ...rest }` — focus 시 primary border, 기본 gray border

## NextTimeContext (`src/contexts/NextTimeContext.jsx`)
- `situationIntensity` — `'생각만 나는 정도' | '꽤 당김' | '당장 피우고 싶음' | null`
- `location` — `'집' | '직장/학교' | '이동 중' | '흡연구역 근처' | '술자리' | null`
- `moment` — 순간 문자열 | null
- `recommendedMission` — `{ id, title, description, missionDescription, durationSeconds, whyThisText? }`
- `recordAnswers` — `{ howDidYouDo, currentIntensity, missionFeedback, additionalNote, situationIntensity?, location?, moment?, recommendedMissionId?, recommendedMissionTitle? }` (submit 시 context 스냅샷 포함)
- setters: `setSituationIntensity`, `setLocation`, `setMoment`, `setRecommendedMission`, `setRecordAnswers`, `updateRecordAnswer`, `resetFlow`
- hook: `useNextTime()` — Provider 밖 사용 시 에러

## Mock Data (`src/data/nextTimeMock.js`)
- `CONTEXT_STEPS` — 3단계(상황/장소/순간) 질문·옵션 배열
- `MOCK_RECOMMENDATIONS` — 상황별 추천 미션 3건 (smokingArea/home/stress), `getMockRecommendation()` 분기
- `RECORD_OPTIONS` — 기록하기 3개 라디오 그룹 (Figma NT-RESULT-001 문구)

## 에셋
- 사용 경로: `src/assets/mascot-neutral.svg`, `mascot-craving.svg`, `mascot-urgent.svg`, `mascot-run.svg`, `mascot-success.svg`
- 누락 mood 파일: 없음 (5종 모두 존재)

## 2단계 — ContextFlow / NEXT ME 로딩 (완료)

### 레이아웃
- `src/layouts/NextTimeLayout.jsx` — NextTimeProvider + 다크 배경(`bg_black`) Outlet 래퍼

### 페이지
- `src/pages/next-time/ContextFlowPage.jsx` — CONTEXT_STEPS 3단계 순회, currentStepIndex state, context 값 업데이트, ProgressBar `(index+1)/3`, 마지막 단계 CTA → next-me
- `src/pages/next-time/NextMeLoadingPage.jsx` — NEXT ME 미래의 목소리 로딩, 텍스트 순차 fadeIn + mascot run 애니메이션, 2500ms 후 recommend 이동
- `src/pages/next-time/RecommendPage.jsx` — 추천 미션 placeholder (다음 단계 구현 예정)

### 라우팅 (`src/router.jsx`)
- `/next-time` → NextTimeLayout (index는 `/next-time/context`로 redirect)
- `/next-time/context` — ContextFlowPage
- `/next-time/next-me` — NextMeLoadingPage
- `/next-time/recommend` — RecommendPage

### Mock Data 추가
- `NEXT_ME_LOADING` — 로딩 화면 텍스트 4줄 + closingLine + statusText (`src/data/nextTimeMock.js`)

### 애니메이션
- framer-motion 미설치 — styled-components `keyframes` + `animation-delay`로 구현 (fadeInUp, runMotion, loadingFill/loadingDot)

## 3단계 — Recommend / Mission (완료)

### 페이지
- `src/pages/next-time/RecommendPage.jsx` — recommendedMission 표시, CircularTimer(전체 시간), WhyThisBox, 시작하기→mission, 건너뛰기→record
- `src/pages/next-time/MissionPage.jsx` — durationSeconds부터 1초 interval 카운트다운, CircularTimer 게이지 연동, 0초 시 record 자동 이동, 건너뛰기→record
- `src/pages/next-time/RecordPage.jsx` — 기록하기 placeholder (다음 단계 구현 예정)

### 라우팅 추가
- `/next-time/mission` — MissionPage
- `/next-time/record` — RecordPage

### 타이머 구현 (MissionPage)
- `useState(durationSeconds)`로 remainingSeconds 초기화, `setInterval(1000ms)`로 1초 단위 감소
- `CircularTimer`에 `totalSeconds`/`remainingSeconds` 전달 → stroke-dashoffset으로 게이지 애니메이션
- `remainingSeconds <= 0` 시 `navigate('/next-time/record')`
- `useEffect` cleanup에서 `clearInterval` 처리 (unmount·페이지 이탈 시 메모리 누수 방지)

## 4단계 — Record / Complete (완료) — 플로우 전체 구현 완료

### 페이지
- `src/pages/next-time/RecordPage.jsx` — RECORD_OPTIONS 3개 라디오 그룹 + TextAreaField 선택 입력, 필수 3항목 선택 시 기록하기 활성화, submit→complete
- `src/pages/next-time/CompletePage.jsx` — 종료 화면, mascot success, insight 박스, 패턴/홈 이동 시 resetFlow

### 라우팅 추가
- `/next-time/complete` — CompletePage

### Mock Data 추가
- `RECORD_NOTE` — 선택 입력 라벨·힌트·placeholder
- `COMPLETE_CONTENT` — 종료 화면 타이틀·insight 텍스트

### 플로우 최종 라우팅 (5단계)
- ContextFlow: `/next-time/context` (또는 `/next-time` index redirect)
- NEXT ME 로딩: `/next-time/next-me`
- Recommend: `/next-time/recommend`
- Mission: `/next-time/mission`
- Record: `/next-time/record`
- Complete: `/next-time/complete`
- 전체 NextTimeLayout + NextTimeProvider 하위

### Complete 페이지 이탈 처리
- 뒤로가기·내 패턴 보러가기(`/pattern`)·홈으로 가기(`/`) 시 `resetFlow()` 호출 후 이동

## 최종 점검 결과 (Figma NT 섹션 340:356 대조)

### 불일치 — 디자인/텍스트
- Record: `howDidYouDo` 옵션 문구 3개 모두 Figma와 불일치 (예: Figma "미루다가 피웠어요"/"피웠어요" vs 코드 "11분 미룸"/"바로 흡연")
- Record: `currentIntensity` 옵션 4개 문구 전부 Figma와 불일치 (예: Figma "이제 괜찮아요"/"생각만 나요" vs 코드 "생각만 나는 정도" 등)
- Record: `missionFeedback` 2·3번 옵션 Figma "잘 모르겠어요"/"나랑은 안 맞아요" vs 코드 "보통이에요"/"아쉬웠어요"
- ContextFlow: moment 옵션 Figma "쉬다가 / 심심해서" vs 코드 "쉬다가·심심해서"
- Mission: 하단 설명 Figma "반대 방향으로 걸으면 돼요…" 2줄 vs 코드 recommend용 description 1줄
- Recommend: description·Complete subtitle 등 Figma 줄바꿈 위치와 코드 단일 줄 표시 차이
- ContextFlow: NEXT TIME 라벨 위치 Figma(메인 타이틀 위 블록) vs 코드(Header nav 행)
- Mission: "미션 진행 중" Figma Caption Regular vs 코드 font-weight 700

### 불일치 — 기능/구성
- Recommend: WhyThisBox Figma NT-RECOMMEND-001에 없음 (코드에만 표시)
- ContextFlow 선택값(situationIntensity/location/moment) Recommend·Record UI에서 읽기/표시 없음, 추천 mock도 비연동

### 코드 점검 — 이상 없음
- Record 필수 3항목 미선택 시 `기록하기` disabled (`isFormValid` + `PrimaryButton disabled`)
- Mission `setInterval` unmount cleanup (`clearInterval` in useEffect return)
- Complete 이탈 시 `resetFlow()` (뒤로가기·패턴·홈)
- 라우팅 분기 연결 완료 (context→next-me→recommend→mission/record→record→complete, recommend 건너뛰기→record)
- ContextFlow ProgressBar 단계별 33%/66%/100% — Figma 1/3·2/3·3/3와 일치
- 마스코트 mood 매핑: Context 카드 neutral/craving/urgent, NEXT ME run, Complete success — 에셋 경로 정상

## 1차 수정 완료

### 데이터 흐름
- ContextFlow 선택값 → NextMeLoadingPage에서 `getMockRecommendation()` → `setRecommendedMission` → Recommend/Mission/Record에서 context 참조, Record submit 시 `recordAnswers`에 context+미션 스냅샷 저장

### 수정 내용
- `getMockRecommendation()` + `MOCK_RECOMMENDATIONS` 3건 추가, NextMeLoadingPage에서 상황별 추천 분기
- Record submit 시 context 스냅샷 `recordAnswers`에 병합
- Recommend/Record Figma 외 UI 제거 — context 칩 요약·「입력하신 상황」 섹션 삭제 (데이터 연결은 NextMeLoading/submit 로직에만 유지)
