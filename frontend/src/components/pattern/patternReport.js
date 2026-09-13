import actionWalk from "../../assets/pattern/action-walk.png";
import actionWater from "../../assets/pattern/action-water.png";
import actionBreathe from "../../assets/pattern/action-breathe.png";

export const REQUIRED_PATTERN_RECORDS = 5;

const ACTION_POOL = [
  { name: "걷기", image: actionWalk, height: 102 },
  { name: "물 마시기", image: actionWater, height: 95 },
  { name: "심호흡 하기", image: actionBreathe, height: 94 },
];

export const READY_PATTERN_REPORT = {
  reductionLabel: "1.4개비 ↓",
  caption: "지난주 평균 10.2개비 → 이번 주 평균 8.8개비로 줄었어요",
  tip: "이번 주에는 일·공부가 끝난 후 걷기로 감연해봐요",
  peakSlot: "18–21시",
  peakBarIndex: 6,
  bars: [12, 20, 28, 21, 34, 46, 64, 30, 30],
  situation: "일·공부가 끝난 후",
  situationRate: 75,
  ranks: [
    { name: "스트레스", rate: 33 },
    { name: "식사 후", rate: 25 },
  ],
  actions: ACTION_POOL,
};
