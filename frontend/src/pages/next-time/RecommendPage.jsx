import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useElementHeight } from "../../hooks/useElementHeight";
import { useNextTime } from "../../contexts/NextTimeContext";
import Header from "../../components/next-time/Header";
import CircularTimer from "../../components/next-time/CircularTimer";
import PrimaryButton from "../../components/next-time/PrimaryButton";

function splitMissionTitle(title) {
  const splitIndex = title.search(/\d+분/);
  if (splitIndex > 0) {
    return [title.slice(0, splitIndex).trim(), title.slice(splitIndex).trim()];
  }
  return [title];
}

function RecommendPage() {
  const navigate = useNavigate();
  const { recommendedMission } = useNextTime();
  const { title, description, durationSeconds } = recommendedMission;
  const titleLines = splitMissionTitle(title);

  const [bottomAreaRef, bottomAreaHeight] = useElementHeight();

  const handleStart = () => {
    navigate("/next-time/mission", { replace: true });
  };

  const handleSkip = () => {
    navigate("/next-time/record", { replace: true });
  };

  const handleBack = () => {
    navigate("/next-time/context", { replace: true });
  };

  return (
    <PageContainer>
      <Header title="NEXT TIME" onBack={handleBack} />

      <Content $bottomAreaHeight={bottomAreaHeight}>
        <MissionTitle>
          {titleLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </MissionTitle>

        <CircularTimer
          totalSeconds={durationSeconds}
          remainingSeconds={durationSeconds}
        />

        <Description>{description}</Description>
      </Content>

      <BottomArea ref={bottomAreaRef}>
        <PrimaryButton variant="primary" onClick={handleStart}>
          시작하기
        </PrimaryButton>
        <SkipButton type="button" onClick={handleSkip}>
          건너뛰기
        </SkipButton>
      </BottomArea>
    </PageContainer>
  );
}

export default RecommendPage;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding-inline: 1.25rem;
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  min-height: 0;
  overflow-y: auto;
  margin-top: 2.44rem;
  padding-top: 1.25rem;
  padding-bottom: ${({ $bottomAreaHeight }) => $bottomAreaHeight}rem;
`;

const MissionTitle = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
  word-break: keep-all;
  padding-top: 3.06rem;

  p {
    margin: 0;
  }
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
  word-break: keep-all;
  white-space: pre-line;
`;

const BottomArea = styled.div`
  position: absolute;
  left: 1.25rem;
  right: 1.25rem;
  bottom: 0;
  padding: 2.5rem 0.94rem 2.06rem;

  display: flex;
  flex-direction: column;
  align-items: center;

  background: linear-gradient(
    to bottom,
    rgba(10, 10, 20, 0) 0%,
    rgba(10, 10, 20, 0.85) 35%,
    rgba(10, 10, 20, 0.85) 100%
  );

  pointer-events: none;

  & > button {
    opacity: 0.92;
    pointer-events: auto;
  }
`;

const SkipButton = styled.button`
  width: 100%;
  height: 3.5rem;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  cursor: pointer;
`;
