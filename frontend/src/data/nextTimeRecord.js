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
