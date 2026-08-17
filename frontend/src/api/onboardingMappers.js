export const SMOKING_FREQUENCY_MAP = {
    "5개비 이하": "UP_TO_5",
    "6~10개비": "SIX_TO_TEN",
    "11~20개비": "ELEVEN_TO_FIFTEEN", // TODO: 서버 5단계 vs 화면 4단계 불일치 확인 필요
    "20개비 이상": "TWENTY_ONE_OR_MORE", // TODO: 마찬가지
};

export const SMOKING_CONTEXT_MAP = {
    "일·공부가 끝났을 때": "AFTER_WORK_OR_CLASS",
    "스트레스 받을 때": "STRESS",
    "식사 후": "AFTER_MEAL",
    "술자리에서": "DRINKING_OR_SOCIAL",
    "쉬고 있을 때": "BOREDOM_OR_HABIT",
    "다른 사람이 피우러 갈 때": "OTHER", // TODO: 확인 필요
    "이동할 때": "OTHER", // TODO: 확인 필요
    "기타": "OTHER",
};

export const TOBACCO_TYPE_MAP = {
    "일반 담배": "CIGARETTE",
    "궐련형 전자담배": "HEATED_TOBACCO",
    "액상형 전자담배": "LIQUID_E_CIGARETTE",
};

export const CHANGE_GOAL_MAP = {
    "완전히 끊고 싶어요": "QUIT",
    "우선 줄여가고 싶어요": "REDUCE",
    "아직 정하지 못했어요": "UNDECIDED",
};

export const CHANGE_REASON_MAP = {
    "체력·건강": "HEALTH_FITNESS",
    "가족·사람": "FAMILY_PEOPLE",
    "돈": "COST",
    "자유": "FREEDOM",
    "외모·냄새": "SMELL_APPEARANCE",
    "임신·아이": "PREGNANCY_CHILD",
    "취미·일상": "HOBBY_DAILY",
    "직접 입력": "OTHER",
};

export const COPING_ACTION_MAP = {
    "그 자리에서 벗어나기": "LEAVE_THE_PLACE",
    "잠깐 걷기": "TAKE_A_WALK",
    "물 마시기": "DRINK_WATER",
    "양치하거나 입 헹구기": "BRUSH_OR_RINSE",
    "껌이나 사탕 먹기": "GUM_OR_CANDY",
    "짧게 스트레칭하기": "STRETCH",
    "호흡 가다듬기": "CONTROL_BREATHING",
    "차가운 물로 손이나 얼굴 씻기": "WASH_WITH_COLD_WATER",
    "음악 듣기": "LISTEN_TO_MUSIC",
    "누군가와 이야기하기": "TALK_TO_SOMEONE",
    "담배를 눈에 안 보이게 두기": "HIDE_CIGARETTES",
    "+ 직접 입력하기": "OTHER",
};