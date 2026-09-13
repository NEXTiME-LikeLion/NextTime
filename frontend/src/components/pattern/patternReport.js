import actionWalk from "../../assets/pattern/action-walk.png";
import actionWater from "../../assets/pattern/action-water.png";
import actionBreathe from "../../assets/pattern/action-breathe.png";
import actionStretch from "../../assets/pattern/action-stretch.png";
import actionMusic from "../../assets/pattern/action-music.png";
import actionLeave from "../../assets/pattern/action-leave.png";

export const REQUIRED_PATTERN_RECORDS = 5;

const ACTION_POOL = [
  { name: "걷기", image: actionWalk, height: 102 },
  { name: "물 마시기", image: actionWater, height: 95 },
  { name: "심호흡 하기", image: actionBreathe, height: 94 },
];

const TIME_SLOT_LABELS = [
  "0–3",
  "3–6",
  "6–9",
  "9–12",
  "12–15",
  "15–18",
  "18–21",
  "21–24",
];

export const WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

function isEmptyValue(value) {
  if (value == null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  ) {
    return true;
  }
  return false;
}

function toFiniteNumber(value) {
  if (isEmptyValue(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeSlotLabel(value) {
  return String(value ?? "")
    .replace(/[~\-–—]/g, "-")
    .replace(/시/g, "")
    .trim();
}

export function getReductionChange(report) {
  const reduction = report?.reduction ?? {};
  const lastWeekAverage = toFiniteNumber(reduction.lastWeekAverage);
  const thisWeekAverage = toFiniteNumber(reduction.thisWeekAverage);
  const rawDaily = Array.isArray(reduction.dailyAmounts)
    ? reduction.dailyAmounts
    : [];

  return {
    lastWeekAverage,
    thisWeekAverage,
    hasLastWeek: lastWeekAverage != null,
    changeLabel: reduction.changeLabel ?? report?.reductionLabel ?? "",
    insight: reduction.insight ?? "",
    daily: WEEKDAY_LABELS.map((day, index) => ({
      day,
      amount: toFiniteNumber(rawDaily[index]),
    })),
    highlightDay:
      reduction.highlightDay ??
      WEEKDAY_LABELS[(new Date().getDay() + 6) % 7],
  };
}

export function getSmokingTime(report) {
  const time = report?.time ?? {};
  const lastWeekPeak = time.lastWeekPeak ?? null;
  const thisWeekCount = toFiniteNumber(time.thisWeekPeak?.count);
  const rawSlots = Array.isArray(time.slotCounts) ? time.slotCounts : [];
  const rawDays = Array.isArray(time.weekdayPeaks) ? time.weekdayPeaks : [];
  const thisWeekSlot = time.thisWeekPeak?.slot ?? report?.peakSlot ?? "";

  const slots = TIME_SLOT_LABELS.map((label, index) => ({
    label,
    count: toFiniteNumber(rawSlots[index]) ?? 0,
    peak: normalizeSlotLabel(label) === normalizeSlotLabel(thisWeekSlot),
  }));

  return {
    hasLastWeek: Boolean(lastWeekPeak?.slot),
    lastWeekPeak: lastWeekPeak
      ? {
          slot: lastWeekPeak.slot,
          count: toFiniteNumber(lastWeekPeak.count),
        }
      : null,
    thisWeekPeak: {
      slot: thisWeekSlot,
      count: thisWeekCount,
    },
    insight: time.insight ?? "",
    slots,
    weekdayPeaks: WEEKDAY_LABELS.map((day, index) => ({
      day,
      hour: isEmptyValue(rawDays[index]) ? null : String(rawDays[index]),
    })),
  };
}

function sortByRateThenSample(items) {
  return [...items].sort((left, right) => {
    if (right.rate !== left.rate) return right.rate - left.rate;
    return right.total - left.total;
  });
}

function toCompareItem(item) {
  const rate = toFiniteNumber(item?.rate);
  const success = toFiniteNumber(item?.success);
  const total = toFiniteNumber(item?.total);

  if (rate == null) return null;

  return {
    name: item.name ?? "",
    image: item.image,
    rate,
    success,
    total,
  };
}

export function getEasySituations(report) {
  const detail = report?.situationDetail ?? {};
  const rawItems = Array.isArray(detail.items) ? detail.items : [];
  const fallback = [
    {
      name: report?.situation,
      rate: report?.situationRate,
      success: detail.bestSuccess,
      total: detail.bestTotal,
    },
    ...(Array.isArray(report?.ranks) ? report.ranks : []),
  ];

  const items = sortByRateThenSample(
    (rawItems.length > 0 ? rawItems : fallback)
      .map(toCompareItem)
      .filter(Boolean),
  ).slice(0, 6);

  const best = items[0] ?? null;

  return {
    best: best
      ? {
          ...best,
          caption:
            detail.bestCaption ??
            (best.success != null && best.total != null
              ? `${best.total}번 중 ${best.success}번 바로 피우지 않았어요`
              : ""),
        }
      : null,
    items,
  };
}

export function getHelpfulActions(report) {
  const rawItems = Array.isArray(report?.helpfulActions)
    ? report.helpfulActions
    : Array.isArray(report?.actions)
      ? report.actions
      : [];

  const items = sortByRateThenSample(
    rawItems
      .map(toCompareItem)
      .filter((item) => item && item.total > 0),
  ).slice(0, 6);

  const best = items[0] ?? null;

  return {
    best: best
      ? {
          ...best,
          caption:
            best.success != null && best.total != null
              ? `${best.total}번 중 ${best.success}번 흡연 욕구 감소`
              : "",
        }
      : null,
    others: items.slice(1),
  };
}

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
  reduction: {
    lastWeekAverage: 10.2,
    thisWeekAverage: 8.8,
    changeLabel: "1.4 개비↓",
    insight: "기록된 5일 모두 지난주 평균보다 적게 피웠어요",
    dailyAmounts: [10, 9, 8, 9, 8, null, null],
    highlightDay: "금",
  },
  time: {
    lastWeekPeak: { slot: "21~24시", count: 8 },
    thisWeekPeak: { slot: "18~21시", count: 5 },
    insight: "저녁이 여전히 가장 많지만, 지난주보다 3회 줄었어요",
    slotCounts: [0, 0, 1, 2, 2, 3, 5, 2],
    weekdayPeaks: ["19시", "20시", "18시", "19시", "20시", "15시", "19시"],
  },
  situationDetail: {
    bestCaption: "4번 중 3번 바로 피우지 않았어요",
    items: [
      { name: "일·공부 후", rate: 75, success: 3, total: 4 },
      { name: "스트레스", rate: 33, success: 2, total: 6 },
      { name: "식사 후", rate: 25, success: 1, total: 4 },
      { name: "쉬다가·심심", rate: 20, success: 1, total: 5 },
      { name: "술 마실 때", rate: 17, success: 1, total: 6 },
      { name: "다른 사람이 피울 때", rate: 14, success: 1, total: 7 },
    ],
  },
  helpfulActions: [
    { name: "걷기", image: actionWalk, rate: 80, success: 4, total: 5 },
    { name: "물 마시기", image: actionWater, rate: 60, success: 3, total: 5 },
    {
      name: "심호흡 하기",
      image: actionBreathe,
      rate: 60,
      success: 3,
      total: 5,
    },
    { name: "스트레칭", image: actionStretch, rate: 50, success: 2, total: 4 },
    { name: "음악 듣기", image: actionMusic, rate: 40, success: 2, total: 5 },
    {
      name: "자리 벗어나기",
      image: actionLeave,
      rate: 33,
      success: 1,
      total: 3,
    },
  ],
};
