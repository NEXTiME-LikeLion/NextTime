import { getActionImage } from "./actionImages";

const CONTEXT_SHORT_NAME_MAP = {
  AFTER_WORK_OR_CLASS: "일·공부가 끝난 후",
  AFTER_MEAL: "식사 후",
  STRESS: "스트레스",
  DRINKING_OR_SOCIAL: "술자리",
  BOREDOM_OR_HABIT: "심심함",
  AFTER_WAKING: "기상 직후",
  OTHER: "기타",
};

export const REQUIRED_PATTERN_RECORDS = 5;


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


function formatSlotLabel(startHour, endHour) {
  return `${startHour}-${endHour}시`;
}

function toDayLabel(dayOfWeek) {
  const map = {
    MONDAY: "월",
    TUESDAY: "화",
    WEDNESDAY: "수",
    THURSDAY: "목",
    FRIDAY: "금",
    SATURDAY: "토",
    SUNDAY: "일",
  };
  return map[dayOfWeek] ?? "";
}


export function mapApiToReport(apiData) {
  if (!apiData) return null;

  const {
    smokingAmount,
    smokingTime,
    reductionBriefing,
    easyReductionContexts = [],
    effectiveActions = [],
  } = apiData;

  const actions = effectiveActions.map((item) => ({
    name: item.mission?.name ?? "",
    image: getActionImage(item.mission?.code),
    height: 100,
    rate: item.successRatePercent,
    success: item.successCount,
    total: item.totalCount,
  }));

  const situationItems = easyReductionContexts.map((item) => ({
    name: CONTEXT_SHORT_NAME_MAP[item.context?.code] ?? item.context?.name ?? "",
    rate: item.successRatePercent,
    success: item.successCount,
    total: item.totalCount,
  }));

  const topSituation = situationItems[0] ?? null;
  const otherRanks = situationItems.slice(1, 3);

  const peakSlotLabel = smokingTime?.currentPrimarySlot
    ? formatSlotLabel(
      smokingTime.currentPrimarySlot.startHour,
      smokingTime.currentPrimarySlot.endHour,
    )
    : "";

  const bars = (smokingTime?.currentSlots ?? []).map((s) => s.count);
  const peakBarIndex = (smokingTime?.currentSlots ?? []).findIndex(
    (s) =>
      smokingTime?.currentPrimarySlot &&
      s.startHour === smokingTime.currentPrimarySlot.startHour,
  );

  return {
    reductionLabel:
      smokingAmount?.reducedDailyAverage != null
        ? `${Math.abs(smokingAmount.reducedDailyAverage).toFixed(1)}개비 ${smokingAmount.reducedDailyAverage > 0 ? "↓" : "↑"
        }`
        : "",
    caption: smokingAmount?.comparisonMessage ?? "",
    tip: reductionBriefing?.message ?? "",
    peakSlot: peakSlotLabel,
    peakBarIndex: peakBarIndex >= 0 ? peakBarIndex : 0,
    bars,
    situation: topSituation?.name ?? "",
    situationRate: topSituation?.rate ?? 0,
    ranks: otherRanks,
    actions,

    reduction: {
      lastWeekAverage: smokingAmount?.previousDailyAverage ?? null,
      thisWeekAverage: smokingAmount?.currentDailyAverage ?? null,
      changeLabel:
        smokingAmount?.reducedDailyAverage != null
          ? `${Math.abs(smokingAmount.reducedDailyAverage).toFixed(1)} 개비${smokingAmount.reducedDailyAverage > 0 ? "↓" : "↑"
          }`
          : "",
      insight: smokingAmount?.comparisonMessage ?? "",
      dailyAmounts: (smokingAmount?.dailyCounts ?? []).map((d) => d.count),
      highlightDay: toDayLabel(
        (smokingAmount?.dailyCounts ?? []).find((d) => d.tracked)?.dayOfWeek,
      ),
    },

    time: {
      lastWeekPeak: smokingTime?.previousPrimarySlot
        ? {
          slot: formatSlotLabel(
            smokingTime.previousPrimarySlot.startHour,
            smokingTime.previousPrimarySlot.endHour,
          ),
          count: smokingTime.previousPrimarySlot.count,
        }
        : null,
      thisWeekPeak: {
        slot: peakSlotLabel,
        count: smokingTime?.currentPrimarySlot?.count ?? null,
      },
      insight: smokingTime?.comparisonMessage ?? "",
      slotCounts: bars,
      weekdayPeaks: (smokingTime?.dailyPrimaryHours ?? []).map((d) =>
        d.hour != null ? `${d.hour}시` : null,
      ),
    },

    situationDetail: {
      items: situationItems,
    },

    helpfulActions: actions,
  };
}