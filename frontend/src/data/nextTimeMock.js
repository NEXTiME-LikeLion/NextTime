/** NEXT TIME 플로우 mock data — API 연동 전 UI 구현용 */

// export const CONTEXT_STEPS = [
//   {
//     id: "intensity",
//     question: "지금 얼마나 피우고 싶나요?",
//     variant: "card",
//     layout: "grid-2",
//     options: [
//       { value: "생각만 나는 정도", label: "생각만 나는 정도", mood: "neutral" },
//       { value: "꽤 당김", label: "꽤 당김", mood: "craving" },
//       { value: "당장 피우고 싶음", label: "당장 피우고 싶음", mood: "urgent" },
//     ],
//   },
//   {
//     id: "location",
//     question: "지금 어디에 계시나요?",
//     variant: "chip",
//     layout: "grid-3",
//     options: [
//       { value: "집", label: "집" },
//       { value: "직장/학교", label: "직장/학교" },
//       { value: "이동 중", label: "이동 중" },
//       { value: "흡연구역 근처", label: "흡연구역 근처" },
//       { value: "술자리", label: "술자리" },
//     ],
//   },
//   {
//     id: "moment",
//     question: "어떤 순간인가요?",
//     variant: "chip",
//     layout: "list",
//     options: [
//       { value: "일·공부가 끝나서", label: "일·공부가 끝나서" },
//       { value: "밥을 먹고 나서", label: "밥을 먹고 나서" },
//       { value: "스트레스를 받아서", label: "스트레스를 받아서" },
//       { value: "쉬다가 / 심심해서", label: "쉬다가 / 심심해서" },
//       { value: "술을 마시고 있어서", label: "술을 마시고 있어서" },
//       { value: "다른 사람이 피우러 가서", label: "다른 사람이 피우러 가서" },
//     ],
//   },
// ];

export const NEXT_ME_LOADING = {
  lines: [
    "나 오늘 저녁에도 달릴 거잖아",
    "지금 한 대가 너무 당기는 거 알아",
    "근데 몇 시간 뒤의 나는",
    "또 숨이 차서 멈추고 싶지 않아.",
  ],
  closingLine: "이번 한 번만, 나를 먼저 선택해줘",
  statusText: "지금 할 수 있는 행동을 찾고 있어요…",
};

export const MOCK_RECOMMENDATIONS = {
  smokingArea: {
    id: "walk-away",
    title: "흡연구역에서 벗어나 5분만 걸어보기",
    description: "지금은 참으려고 애쓰기보다 먼저 흡연구역에서 멀어져볼게요",
    missionDescription: "반대 방향으로 걸으면 돼요\n지금은 걷는 것만 생각해요",
    durationSeconds: 300,
    whyThisText:
      "퇴근 후 욕구가 강할 때, 장소를 옮겼던 날 흡연을 가장 오래 미뤘어요.",
  },
  home: {
    id: "window-distance",
    title: "창가에서 잠시 멀어지기",
    description: "집에서는 잠깐 자리만 옮겨도 생각이 덜 올라왔어요",
    missionDescription:
      "창가나 발코니 근처만 피하면 돼요\n지금은 숨 고르는 것만 생각해요",
    durationSeconds: 180,
    whyThisText:
      "집에서 욕구가 올라올 때, 공간을 바꾼 날은 바로 흡연으로 이어지지 않았어요.",
  },
  stress: {
    id: "deep-breath",
    title: "심호흡 3번 천천히 해보기",
    description: "스트레스가 올라올 때는 먼저 호흡부터 정리해볼게요",
    missionDescription:
      "어깨를 내리고 천천히 숨을 들이마셔요\n지금은 호흡에만 집중해요",
    durationSeconds: 120,
    whyThisText:
      "스트레스를 받은 순간, 심호흡을 했던 날은 욕구가 더 빨리 가라앉았어요.",
  },
};

export const MOCK_RECOMMENDATION = MOCK_RECOMMENDATIONS.smokingArea;

export function getMockRecommendation({
  situationIntensity,
  location,
  moment,
}) {
  if (location === "흡연구역 근처" || location === "이동 중") {
    return MOCK_RECOMMENDATIONS.smokingArea;
  }

  if (
    moment === "스트레스를 받아서" ||
    situationIntensity === "당장 피우고 싶음"
  ) {
    return MOCK_RECOMMENDATIONS.stress;
  }

  if (location === "집" || situationIntensity === "생각만 나는 정도") {
    return MOCK_RECOMMENDATIONS.home;
  }

  return MOCK_RECOMMENDATIONS.smokingArea;
}

// TODO: API 연동 시 아래 fetch로 교체
// const res = await fetch('/api/next-time/recommendation', { ... });
// const data = await res.json();

export const RECORD_OPTIONS = {
  howDidYouDo: {
    label: "어떻게 했나요?",
    options: [
      { value: "피우지 않았어요", label: "피우지 않았어요" },
      { value: "미루다가 피웠어요", label: "미루다가 피웠어요" },
      { value: "피웠어요", label: "피웠어요" },
    ],
  },
  currentIntensity: {
    label: "지금은 얼마나 피우고 싶나요?",
    options: [
      { value: "이제 괜찮아요", label: "이제 괜찮아요" },
      { value: "생각만 나요", label: "생각만 나요" },
      { value: "꽤 당겨요", label: "꽤 당겨요" },
      { value: "당장 피우고 싶어요", label: "당장 피우고 싶어요" },
    ],
  },
  missionFeedback: {
    label: "방금 미션은 어땠나요?",
    options: [
      { value: "도움이 됐어요", label: "도움이 됐어요" },
      { value: "잘 모르겠어요", label: "잘 모르겠어요" },
      { value: "나랑은 안 맞아요", label: "나랑은 안 맞아요" },
    ],
  },
};

export const RECORD_NOTE = {
  optionalLabel: "더 알려주고 싶은 게 있나요?",
  optionalHint: "남겨주신 내용은 다음 NEXT TIME 추천에 반영할게요",
  placeholder:
    "예) 걷고 나니 조금 괜찮아졌는데, 회사 앞을 지나니까 다시 생각났어요.",
};

export const COMPLETE_CONTENT = {
  title: "방금의 기록 기억해둘게요",
  subtitle: "다음에 비슷한 순간이 오면 오늘의 기록을 먼저 참고할게요",
  insightTitle: "💡 다음에는 이렇게 기억할게요",
  insightText:
    "퇴근 후 욕구가 강할 때, 일단 흡연구역에서 벗어나면 흡연 욕구 강함에서 보통으로 낮아졌어요.",
};
