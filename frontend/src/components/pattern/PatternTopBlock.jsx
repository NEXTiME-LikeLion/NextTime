import styled from "styled-components";

function PatternTopBlock() {
  return (
    <TopBlock>
      <TopRow>
        <TabName>내 패턴</TabName>
        <Recent>최근 7일</Recent>
      </TopRow>
      <PatternDescription>
        기록이 쌓일수록 나에게 잘 맞는 순간과 행동을 찾아드려요.
      </PatternDescription>
    </TopBlock>
  );
}

export default PatternTopBlock;

const TopBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TabName = styled.p`
  color: ${({ theme }) => theme.colors.bg0};
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.4;
`;

const Recent = styled.p`
  color: ${({ theme }) => theme.colors.bg0};
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
`;

const PatternDescription = styled.p`
  color: ${({ theme }) => theme.colors.bg0};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  word-break: keep-all;
`;
