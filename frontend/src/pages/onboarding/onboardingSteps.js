export const ONBOARDING_STEPS = [
    // 1단계
    {
        title: "흡연 습관을 알려주세요",
        questions: [
            {
                key: "smokeType",
                label: "어떤 담배를 주로 피우시나요?",
                note: "* 복수 선택 가능",
                type: "multi",
                options: ["일반 담배", "궐련형 전자담배", "액상형 전자담배"],
            },
            {
                key: "dailyAmount",
                label: "하루에 보통 얼마나 피우시나요?",
                note: "* 일반담배 / 궐련형 전자담배에 기준으로 하나만 선택",
                type: "single",
                layout: "grid",
                options: ["5개비 이하", "6~10개비", "11~20개비", "20개비 이상"],
            },
            {
                key: "desiredChange",
                label: "현재 어떤 변화를 원하시나요?",
                note: "* 하나만 선택",
                type: "single",   // "single-list" → "single"
                options: ["완전히 끊고 싶어요", "우선 줄여가고 싶어요", "아직 정하지 못했어요"],
            },
        ],
    },
    {
        //  2단계 
        title: "어려움을 알려주세요",
        questions: [
            {
                key: "cravingTriggers",
                label: "담배가 가장 자주 생각나는 순간은 언제인가요?",
                note: "* 복수 선택 가능",
                type: "multi",
                options: ["일·공부가 끝났을 때", "스트레스 받을 때", "식사 후", "술자리에서", "쉬고 있을 때", "다른 사람이 피우러 갈 때", "이동할 때", "기타"], // TODO: 정확한 옵션 목록 확인 필요
            },
            {
                key: "hardestMoment",
                label: "특히 끊기 어려운 순간이 있나요?",
                note: "* 자유 입력",
                type: "text",
                required: false,
                textareaHeight: 140,
                placeholder: "예) 퇴근하고 회사 건물 밖으로 나오면 항상 피워요.", // TODO: placeholder 문구 확인 필요
            },
        ],
    },
    {
        // 3단계 
        title: "금연을 하거나 흡연량을 줄이고 싶은\n이유는 무엇인가요?",
        questions: [
            {
                key: "reasonCategory",
                label: "카테고리를 선택해주세요",
                note: "* 최대 2개 선택",
                type: "multi",
                layout: "grid",
                maxSelect: 2,
                options: ["체력·건강", "가족·사람", "돈", "자유", "외모·냄새", "임신·아이", "취미·일상", "직접 입력"],
            },
            {
                key: "motivation",
                label: "결심이 선 계기를 알려주세요.",
                note: "* 자유 입력",
                required: true,
                type: "text",
                placeholder: "예) 러닝을 꾸준히 하는데 항상 숨이 먼저 차서 더 이상 기록이 늘지 않았어요.",
            },
            {
                key: "nextMe",
                label: "앞으로 어떤 내가 되고 싶나요?",
                note: "* 자유 입력",
                required: true,
                type: "text",
                placeholder: "예) 러닝할 때 숨이 차서 먼저 멈추지 않는 나",
            },
            {
                key: "leftMessage",
                label: "그때의 나에게 남겨두고 싶은 말이 있나요?",
                note: "* 자유 입력",
                required: true,
                type: "text",
                placeholder: "예) 러닝도 수영도, 내 체력 때문에 포기하고 싶지 않아. 할 수 있다. 해보자.", // TODO: 정확한 문구 확인 필요
            },
        ],
    },
    {
        // 4단계 
        title: "담배가 생각날 때, 어떤 행동이\n도움이 될 것 같나요?",
        questions: [
            {
                key: "copingActions",
                label: "생각이 덜 나도록 도와주는 행동을 골라주세요.",
                note: "* 복수 선택 가능",
                type: "multi",
                options: ["그 자리에서 벗어나기", "잠깐 걷기", "물 마시기", "양치하거나 입 헹구기", "껌이나 사탕 먹기", "짧게 스트레칭하기", "호흡 가다듬기", "차가운 물로 손이나 얼굴 씻기", "음악 듣기", "누군가와 이야기하기", "담배를 눈에 안 보이게 두기", "+ 직접 입력하기"], // TODO: "그 자리에서 벗어나기", "깊게 숨쉬기" 등 - 정확한 전체 목록 확인 필요
                allowCustomInput: true,
            },
        ],
    },
];
