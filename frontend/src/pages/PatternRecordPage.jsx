import { useEffect, useMemo, useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { useLocation } from "react-router-dom";
import BackHeader from "../components/common/BackHeader";
import SmokingLogModal from "../components/common/SmokingLogModal";
import RecordDetailSheet from "../components/pattern/RecordDetailSheet";
import Toast from "../components/Toast/Toast";
import RecordList, { RecordItem } from "../components/pattern/RecordList";
import { mapRecordListItem } from "../components/pattern/mapRecordItem";
import ApiStatusView from "../components/common/ApiStatusView";
import useAsync from "../hooks/useAsync";
import { getRecords } from "../api/record";
import styled from "styled-components";
import Plus from "../assets/plus.svg";

function PatternRecordPage() {
  const location = useLocation();
  const selectedIdFromState = location.state?.selectedId;
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useAsync(getRecords);
  const records = useMemo(
    () => (data?.records ?? []).map(mapRecordListItem),
    [data],
  );

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!selectedIdFromState || records.length === 0) return;

    const found = records.find((record) => record.id === selectedIdFromState);
    if (!found) return;

    setSelectedRecord(found);
    setIsSheetOpen(true);
  }, [selectedIdFromState, records]);

  const handleItemClick = (record) => {
    setSelectedRecord(record);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <PageContainer>
      <HeaderWrap>
        <BackHeader title="기록" />
      </HeaderWrap>

      <ApiStatusView
        isLoading={isLoading && !data}
        error={!data ? error : null}
        onRetry={refetch}
        loadingTitle="기록을 불러오는 중이에요"
      >
        {data ? (
          <ScrollContent>
            {records.length > 0 ? (
              <RecordList
                recordList={records}
                onClick={handleItemClick}
                ItemComponent={RecordPageItem}
              />
            ) : (
              <EmptyText>아직 기록이 없어요</EmptyText>
            )}
          </ScrollContent>
        ) : null}
      </ApiStatusView>

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
        onSuccess={() => refetch()}
      />

      <RecordDetailSheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        record={selectedRecord}
      />

      {toast && <Toast message={toast.message} />}
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

const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
  padding-top: 2.5rem;
`;

const RecordPageItem = styled(RecordItem)`
  cursor: pointer;
`;

const AddButton = styled.button`
  position: absolute; /* 화면 기준 고정 */
  bottom: 2.75rem;
  right: 1.25rem;

  border: none;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 27.5735rem;
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
