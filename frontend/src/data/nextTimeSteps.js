export const CONTEXT_STEPS = [
  {
    id: "intensity",
    question: "지금 얼마나 피우고 싶나요?",
    variant: "card",
    layout: "grid-2",
    options: [
      { value: "생각만 나는 정도", label: "생각만 나는 정도", mood: "neutral" },
      { value: "꽤 당김", label: "꽤 당김", mood: "craving" },
      { value: "당장 피우고 싶음", label: "당장 피우고 싶음", mood: "urgent" },
    ],
  },
  {
    id: "location",
    question: "지금 어디에 계시나요?",
    variant: "chip",
    layout: "grid-3",
    options: [
      { value: "집", label: "집" },
      { value: "직장/학교", label: "직장/학교" },
      { value: "이동 중", label: "이동 중" },
      { value: "흡연구역 근처", label: "흡연구역 근처" },
      { value: "술자리", label: "술자리" },
    ],
  },
  {
    id: "moment",
    question: "어떤 순간인가요?",
    variant: "chip",
    layout: "list",
    options: [
      { value: "일·공부가 끝나서", label: "일·공부가 끝나서" },
      { value: "밥을 먹고 나서", label: "밥을 먹고 나서" },
      { value: "스트레스를 받아서", label: "스트레스를 받아서" },
      { value: "쉬다가 / 심심해서", label: "쉬다가 / 심심해서" },
      { value: "술을 마시고 있어서", label: "술을 마시고 있어서" },
      { value: "다른 사람이 피우러 가서", label: "다른 사람이 피우러 가서" },
    ],
  },
];
