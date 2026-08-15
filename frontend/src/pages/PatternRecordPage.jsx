import { useMemo, useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { useLocation, useNavigate } from "react-router-dom";
import BackHeader from "../components/common/BackHeader";
import SmokingLogModal from "../components/common/SmokingLogModal";
import RecordDetailSheet from "../components/common/RecordDetailSheet";
import Toast from "../components/Toast/Toast";
import {
  RecordList,
  RecordItem,
  RecordTitle,
  RecordMeta,
  Status,
} from "../components/pattern/sections/RecentRecordsSection";
import styled from "styled-components";
import Plus from "../assets/plus.svg";

// TODO: API 연동 시 교체
const mockRecords = [
  {
    id: 1,
    title: "흡연구역에서 벗어나 5분 걷기",
    time: "오늘 18:24",
    moment: "일·공부 끝난 뒤",
    record: "피우지 않았어요",
    status: ["강함", "보통"],
    delayTime: "-",
    actionImpact: "도움이 됐어요",
    myMessage:
      "걷고 나니 조금 나아졌지만, 회사 앞만 지나가면 다시 생각이 나더라고요",
  },
  {
    id: 2,
    title: "물 마시기",
    time: "어제 17:15",
    moment: "식사 후",
    record: "11분 미룸",
    status: ["미룸", "이후 흡연"],
    delayTime: "11분",
    actionImpact: "조금 도움이 됐어요",
    myMessage: "물 한 잔을 마시고 나니까 흡연 욕구가 살짝 약해졌어요.",
  },
  {
    id: 3,
    title: "휴대폰 대신 심호흡하기",
    time: "어제 16:05",
    moment: "업무 중간",
    record: "피우지 않았어요",
    status: ["보통", "완화"],
    delayTime: "1시간 10분",
    actionImpact: "도움이 됐어요",
    myMessage: "심호흡을 3번 하고 나니 갑자기 가슴이 편해졌어요.",
  },
  {
    id: 4,
    title: "흡연구역에서 벗어나 5분 걷기",
    time: "2일 전 15:42",
    moment: "회의 직후",
    record: "바로 흡연",
    status: ["강함", "바로 흡연"],
    delayTime: "-",
    actionImpact: "아쉬웠어요",
    myMessage: "스트레스를 많이 받는 순간이어서 생각보다 빨리 무너졌어요.",
  },
  {
    id: 5,
    title: "스트레칭 하기",
    time: "3일 전 14:11",
    moment: "오후 피로감",
    record: "피우지 않았어요",
    status: ["보통", "완화"],
    delayTime: "22분",
    actionImpact: "도움이 됐어요",
    myMessage: "어깨를 풀고 나니 걱정했던 순간이 훨씬 덜 강하게 느껴졌어요.",
  },
  {
    id: 6,
    title: "창가에서 잠시 멀어지기",
    time: "4일 전 13:08",
    moment: "점심시간",
    record: "11분 미룸",
    status: ["미룸", "다시 생각"],
    delayTime: "11분",
    actionImpact: "보통이에요",
    myMessage:
      "흡연구역 근처를 지나가자마자 욕구가 올라왔지만 잠시 벗어나니 괜찮아졌어요.",
  },
  {
    id: 7,
    title: "물 마시기",
    time: "1주 전 11:50",
    moment: "아침 직후",
    record: "피우지 않았어요",
    status: ["보통", "완화"],
    delayTime: "32분",
    actionImpact: "도움이 됐어요",
    myMessage: "아침에 물을 마시고 나니 상당히 덜 생각나서 한결 편했어요.",
  },
  {
    id: 8,
    title: "흡연구역에서 벗어나 5분 걷기",
    time: "2주 전 09:12",
    moment: "집 앞",
    record: "피우지 않았어요",
    status: ["강함", "완화"],
    delayTime: "1시간 40분",
    actionImpact: "도움이 됐어요",
    myMessage: "가볍게 산책을 하며 잠깐 마음을 정리하니 훨씬 나아졌어요.",
  },
  {
    id: 9,
    title: "심호흡 3회 반복",
    time: "2주 전 20:48",
    moment: "저녁 식사 후",
    record: "피우지 않았어요",
    status: ["보통", "완화"],
    delayTime: "15분",
    actionImpact: "도움이 됐어요",
    myMessage: "잠깐의 호흡을 통해 긴장감을 내려놓을 수 있었어요.",
  },
  {
    id: 10,
    title: "물 마시기",
    time: "3주 전 08:44",
    moment: "아침",
    record: "11분 미룸",
    status: ["미룸", "이후 흡연"],
    delayTime: "11분",
    actionImpact: "보통이에요",
    myMessage: "아침에 물을 마셨지만 잠깐 흡연 욕구가 다시 올라왔어요.",
  },
  {
    id: 11,
    title: "휴대폰 대신 산책하기",
    time: "3주 전 18:32",
    moment: "퇴근길",
    record: "피우지 않았어요",
    status: ["강함", "완화"],
    delayTime: "27분",
    actionImpact: "도움이 됐어요",
    myMessage: "퇴근길 스마트폰을 내려놓고 가볍게 걸으니 마음이 정리됐어요.",
  },
  {
    id: 12,
    title: "창가에서 잠깐 떨어지기",
    time: "1개월 전 12:16",
    moment: "점심시간",
    record: "11분 미룸",
    status: ["미룸", "다시 생각"],
    delayTime: "11분",
    actionImpact: "보통이에요",
    myMessage:
      "흡연구역 근처를 피해서 잠깐 멀리 서 있자마자 마음이 진정됐어요.",
  },
  {
    id: 13,
    title: "스트레칭 하기",
    time: "1개월 전 17:42",
    moment: "업무 마감 직전",
    record: "피우지 않았어요",
    status: ["보통", "완화"],
    delayTime: "52분",
    actionImpact: "도움이 됐어요",
    myMessage: "목과 어깨를 풀고 나니 너무 급하게 흡연을 떠올리진 않았어요.",
  },
  {
    id: 14,
    title: "커피 대신 물 마시기",
    time: "6주 전 10:20",
    moment: "오전 회의 전",
    record: "피우지 않았어요",
    status: ["보통", "완화"],
    delayTime: "40분",
    actionImpact: "도움이 됐어요",
    myMessage: "커피 대신 물을 마시고 나니 긴장감이 조금 줄어들었어요.",
  },
  {
    id: 15,
    title: "흡연구역에서 벗어나 5분 걷기",
    time: "6주 전 18:03",
    moment: "집 앞",
    record: "바로 흡연",
    status: ["강함", "바로 흡연"],
    delayTime: "-",
    actionImpact: "아쉬웠어요",
    myMessage: "몸이 피곤했던 날이라서 생각보다 금방 무너졌어요.",
  },
  {
    id: 16,
    title: "심호흡 및 물 마시기",
    time: "2개월 전 21:14",
    moment: "잠들기 전",
    record: "피우지 않았어요",
    status: ["보통", "완화"],
    delayTime: "1시간 5분",
    actionImpact: "도움이 됐어요",
    myMessage: "잠들기 전 심호흡과 물 마시기가 마음을 안정시켜주었어요.",
  },
];

function PatternRecordPage() {
  // 기록 별 시트
  const navigate = useNavigate();
  const location = useLocation();
  const selectedIdFromState = location.state?.selectedId;

  const [selectedRecord, setSelectedRecord] = useState(() => {
    return (
      mockRecords.find((record) => record.id === selectedIdFromState) ??
      mockRecords[0]
    );
  });
  const [isSheetOpen, setIsSheetOpen] = useState(Boolean(selectedIdFromState));

  const records = useMemo(() => mockRecords, []);

  const handleItemClick = (record) => {
    setSelectedRecord(record);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  // 빠른 흡연 기록 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (selected) => {
    // TODO: API 연동 - reason 전송 코드 추가
    console.log("기록된 이유:", selected);
    showToast("기록했어요. 다음 추천에 반영할게요.");
    setIsModalOpen(false);
  };

  return (
    <PageContainer>
      <HeaderWrap>
        <BackHeader title="기록" />
      </HeaderWrap>

      <ScrollContent>
        <RecordList>
          {records.map((record) => (
            <RecordPageItem
              key={record.id}
              type="button"
              onClick={() => handleItemClick(record)}
            >
              <RecordTitle>{record.title}</RecordTitle>
              <RecordMeta>
                {record.time} | {record.moment} |{" "}
                <Status $status={record.status}>
                  {record.status.length === 2
                    ? record.status.join(" → ")
                    : record.status[0]}
                </Status>
              </RecordMeta>
            </RecordPageItem>
          ))}
        </RecordList>
      </ScrollContent>

      <AddButton
        type="button"
        aria-label="기록 추가"
        onClick={() => setIsModalOpen(true)}
      >
        <AddImg src={Plus} />
      </AddButton>

      <SmokingLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <RecordDetailSheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        record={selectedRecord}
      />
    </PageContainer>
  );
}

export default PatternRecordPage;

const PageContainer = styled.div`
  position: relative;
  height: 100%; /* 부모 레이아웃 기준으로 꽉 채움 */
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.bg0};
`;

const HeaderWrap = styled.div`
  flex-shrink: 0; /* 헤더 영역은 줄어들지 않게 고정 */
`;

const ScrollContent = styled.div`
  flex: 1; /* 남은 공간 전부 차지 */
  overflow-y: auto; /* 이 영역만 스크롤 */
  padding: 3.87rem 1.25rem 1.75rem 1.25rem;
`;

const RecordPageItem = styled(RecordItem)`
  cursor: pointer;
`;

const AddButton = styled.button`
  position: absolute; /* 화면 기준 고정 */
  bottom: 2.75rem;
  right: 1.25rem;

  border: none;
  border-radius: 27.5735rem;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.25);

  display: flex;
  width: 3.75rem;
  height: 3.75rem;
  padding: 0.77206rem;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
  z-index: 10; /* 콘텐츠 위에 항상 보이도록 */
  cursor: pointer;
`;

const AddImg = styled.img`
  width: 2.20588rem;
  height: 2.20588rem;
  flex-shrink: 0;
  aspect-ratio: 1/1;
`;
