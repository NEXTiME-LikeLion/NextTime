import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

// TODO: API 연동 시 교체
const mockRecords = [
  {
    id: 1,
    title: "퇴근 직후 흡연구역 앞",
    time: "오늘 오후 6:12",
    place: "흡연구역 앞",
    trigger: "퇴근 후 피로감",
    action: "흡연구역에서 벗어나 5분 걷기",
    detail:
      "오늘은 퇴근 직후 몸이 힘들어 흡연구역 앞을 지나가며 욕구가 강하게 올라왔어요. 잠시 자리를 옮겨 걷고 물을 마신 뒤 자극이 줄어들었습니다.",
    status: "흡연",
  },
  {
    id: 2,
    title: "점심시간 회의 직전",
    time: "어제 오후 1:08",
    place: "사무실 로비",
    trigger: "스트레스",
    action: "복도 한 바퀴 돌기",
    detail:
      "회의 직전에 긴장감이 커졌고, 담배를 피우고 싶다는 생각이 들었어요. 로비를 한 바퀴 돌고 다시 앉아보니 생각이 가라앉았습니다.",
    status: "미룸",
  },
  {
    id: 3,
    title: "술자리 뒤 야외 흡연장",
    time: "지난주 금요일 10:42",
    place: "야외 흡연장",
    trigger: "술자리 후 반응",
    action: "다른 사람과 대화하며 잠깐 머무르기",
    detail:
      "술자리 뒤에 더위를 식히려 밖으로 나온 순간 흡연욕구가 강하게 올라왔어요. 다른 사람과 대화를 이어가며 순간을 버텼습니다.",
    status: "넘김",
  },
  {
    id: 4,
    title: "출근 전 출입문 앞",
    time: "지난주 목요일 7:20",
    place: "건물 입구",
    trigger: "아침 불안",
    action: "심호흡 후 2분간 호흡 정리",
    detail:
      "출근 전 급하게 준비하느라 불안이 커졌고, 담배가 가장 먼저 떠올랐어요. 심호흡을 하고 물을 마신 뒤 마음이 조금 진정됐습니다.",
    status: "넘김",
  },
  {
    id: 5,
    title: "점심 먹고 직후",
    time: "지난주 화요일 12:40",
    place: "카페 앞",
    trigger: "배고픔과 피로",
    action: "물 마시고 산책하기",
    detail:
      "식후 피로감이 몰려오자 금방 담배 생각이 났어요. 물을 마시고 5분 걷는 것으로 충동을 넘길 수 있었습니다.",
    status: "넘김",
  },
  {
    id: 6,
    title: "퇴근 후 지하철역",
    time: "지난주 월요일 7:58",
    place: "지하철역 4번 출구",
    trigger: "긴장감",
    action: "다른 플랫폼으로 이동하기",
    detail:
      "지하철을 기다리며 긴장감이 커졌고, 주변에 흡연구역이 보여 욕구가 올라왔습니다. 다른 방향으로 이동하며 상황을 바꾸었습니다.",
    status: "미룸",
  },
];

function PatternRecordPage() {
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

  return (
    <PageContainer>
      <Header>
        <BackButton
          type="button"
          onClick={() => navigate("/pattern")}
          aria-label="뒤로 가기"
        >
          ←
        </BackButton>
        <HeaderTitle>기록</HeaderTitle>
        <Counter>{records.length}</Counter>
      </Header>

      <List>
        {records.map((record) => (
          <RecordItem
            key={record.id}
            type="button"
            onClick={() => handleItemClick(record)}
          >
            <ItemTop>
              <Title>{record.title}</Title>
              <Status $status={record.status}>{record.status}</Status>
            </ItemTop>
            <Meta>{record.time}</Meta>
            <Meta>{record.place}</Meta>
          </RecordItem>
        ))}
      </List>

      <AddButton type="button" aria-label="기록 추가">
        +
      </AddButton>

      {isSheetOpen && selectedRecord && (
        <>
          <SheetOverlay onClick={handleCloseSheet} />
          <BottomSheet
            role="dialog"
            aria-modal="true"
            aria-labelledby="record-sheet-title"
          >
            <SheetHandle />
            <SheetHeader>
              <SheetLabel>{selectedRecord.time}</SheetLabel>
              <CloseButton
                type="button"
                onClick={handleCloseSheet}
                aria-label="닫기"
              >
                ×
              </CloseButton>
            </SheetHeader>

            <SheetTitle id="record-sheet-title">
              {selectedRecord.title}
            </SheetTitle>
            <SheetBadgeWrap>
              <SheetBadge>{selectedRecord.place}</SheetBadge>
              <SheetBadge>{selectedRecord.trigger}</SheetBadge>
            </SheetBadgeWrap>

            <SheetSection>
              <SectionTitle>상황</SectionTitle>
              <SectionText>{selectedRecord.detail}</SectionText>
            </SheetSection>

            <SheetSection>
              <SectionTitle>대처 방법</SectionTitle>
              <SectionText>{selectedRecord.action}</SectionText>
            </SheetSection>
          </BottomSheet>
        </>
      )}
    </PageContainer>
  );
}

export default PatternRecordPage;

const PageContainer = styled.div`
  position: relative;
  min-height: 100%;
  padding: 1rem 1.25rem 5rem;
  background: ${({ theme }) => theme.colors.bg0};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.5rem;
  margin-bottom: 1.25rem;
`;

const BackButton = styled.button`
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
`;

const HeaderTitle = styled.h2`
  flex: 1;
  text-align: center;
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 1.125rem;
  font-weight: 800;
`;

const Counter = styled.span`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  font-weight: 700;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RecordItem = styled.button`
  width: 100%;
  text-align: left;
  border: 1px solid rgba(178, 178, 178, 0.22);
  border-radius: 1rem;
  background: rgba(178, 178, 178, 0.04);
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const ItemTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const Title = styled.p`
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.4;
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.625rem;
  font-weight: 700;
  background: ${({ $status, theme }) =>
    $status === "흡연"
      ? "rgba(255, 104, 104, 0.12)"
      : $status === "미룸"
        ? "rgba(26, 136, 255, 0.12)"
        : "rgba(0, 213, 121, 0.12)"};
  color: ${({ $status, theme }) =>
    $status === "흡연"
      ? "#E34B4B"
      : $status === "미룸"
        ? "#1F6FE5"
        : theme.colors.primary};
`;

const Meta = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
`;

const AddButton = styled.button`
  position: fixed;
  right: 1.25rem;
  bottom: calc(var(--safe-bottom, 0px) + 1.25rem);
  width: 3.5rem;
  height: 3.5rem;
  border: none;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 2rem;
  font-weight: 500;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 213, 121, 0.35);
  z-index: 30;
  cursor: pointer;
`;

const SheetOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(14, 16, 34, 0.45);
  z-index: 40;
`;

const BottomSheet = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  background: ${({ theme }) => theme.colors.bg0};
  border-radius: 1.5rem 1.5rem 0 0;
  box-shadow: 0 -0.5rem 1.5rem rgba(14, 16, 34, 0.18);
  padding: 0.75rem 1.25rem 1.5rem;
  animation: slideUp 0.2s ease;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const SheetHandle = styled.div`
  width: 2.75rem;
  height: 0.25rem;
  border-radius: 999px;
  background: rgba(178, 178, 178, 0.5);
  margin: 0 auto 1rem;
`;

const SheetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const SheetLabel = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.75rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
`;

const SheetTitle = styled.h3`
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 1.25rem;
  font-weight: 800;
  margin-top: 0.5rem;
`;

const SheetBadgeWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const SheetBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  background: rgba(178, 178, 178, 0.12);
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 0.75rem;
  font-weight: 600;
`;

const SheetSection = styled.div`
  margin-top: 1.25rem;
`;

const SectionTitle = styled.h4`
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
`;

const SectionText = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.6;
`;
