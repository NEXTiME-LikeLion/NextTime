const CRAVING_LABEL = {
  HIGH: "강함",
  MEDIUM: "보통",
  LOW: "약함",
  NONE: "없음",
};

const RESULT_LABEL = {
  NOT_SMOKED: "피우지 않았어요",
  DELAYED: "바로 피우지 않았어요",
  SMOKED: "바로 흡연",
};

const HELPFULNESS_LABEL = {
  HELPFUL: "도움이 됐어요",
  SOMEWHAT_HELPFUL: "조금 도움이 됐어요",
  NEUTRAL: "잘 모르겠어요",
  UNKNOWN: "잘 모르겠어요",
  NOT_HELPFUL: "나랑은 안 맞아요",
  UNHELPFUL: "나랑은 안 맞아요",
};

export function formatRecordedAt(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const diffDays = Math.round((startOfToday - startOfTarget) / 86_400_000);
  const time = `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;

  if (diffDays === 0) return `오늘 ${time}`;
  if (diffDays === 1) return `어제 ${time}`;
  if (diffDays < 7) return `${diffDays}일 전 ${time}`;
  if (diffDays < 14) return `1주 전 ${time}`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전 ${time}`;
  if (diffDays < 60) return `1개월 전 ${time}`;
  return `${Math.floor(diffDays / 30)}개월 전 ${time}`;
}

function mapRecordStatus(record) {
  if (record.recordType === "MANUAL_SMOKING") {
    return ["흡연함"];
  }

  if (record.result === "SMOKED") {
    return ["바로 흡연"];
  }

  const before = CRAVING_LABEL[record.cravingBefore];
  const after = CRAVING_LABEL[record.cravingAfter];

  if (before && after) {
    return [`욕구 ${before}`, after];
  }

  if (record.result === "NOT_SMOKED") {
    return ["피우지 않았어요"];
  }

  if (record.result === "DELAYED") {
    return ["바로 피우지 않았어요"];
  }

  return [];
}

export function mapRecordListItem(record) {
  const isManual = record.recordType === "MANUAL_SMOKING";

  return {
    id: record.recordId,
    recordType: record.recordType,
    title: record.mission?.name ?? (isManual ? "직접 기록한 흡연" : ""),
    time: formatRecordedAt(record.recordedAt),
    moment: record.trigger?.name ?? "",
    location: record.location?.name ?? "",
    record: isManual ? "흡연함" : (RESULT_LABEL[record.result] ?? ""),
    status: mapRecordStatus(record),
  };
}

function formatMissionDuration(seconds) {
  if (seconds == null || seconds < 0) return "";

  const minutes = Math.floor(seconds / 60);
  const remainSeconds = seconds % 60;

  if (minutes === 0) return `${remainSeconds}초`;
  if (remainSeconds === 0) return `${minutes}분`;
  return `${minutes}분 ${remainSeconds}초`;
}

function formatCravingChange(record) {
  const before = CRAVING_LABEL[record.cravingBefore];
  const after = CRAVING_LABEL[record.cravingAfter];
  if (before && after) return `${before} → ${after}`;
  return before || after || "";
}

export function mapRecordDetail(record) {
  const isManual = record.recordType === "MANUAL_SMOKING";

  const fields = isManual
    ? [
        { label: "상황", value: record.trigger?.name },
        { label: "흡연 기록", value: "흡연함" },
      ]
    : [
        { label: "미션", value: record.mission?.name },
        { label: "상황", value: record.trigger?.name },
        { label: "장소", value: record.location?.name },
        { label: "흡연 기록", value: RESULT_LABEL[record.result] },
        { label: "흡연 욕구", value: formatCravingChange(record) },
        {
          label: "미션 시간",
          value: formatMissionDuration(record.missionDurationSeconds),
        },
        {
          label: "행동 체감",
          value:
            HELPFULNESS_LABEL[record.missionHelpfulness] ??
            record.missionHelpfulness,
        },
        { label: "내가 남긴 말", value: record.feedback },
      ];

  return {
    time: formatRecordedAt(record.recordedAt),
    fields: fields.filter((field) => field.value),
  };
}
