import { useNavigate } from "react-router-dom";
import styled from "styled-components";
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

  const handleStart = () => {
    navigate("/next-time/mission");
  };

  const handleSkip = () => {
    navigate("/next-time/record", { replace: true });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <PageContainer>
      <Header title="NEXT TIME" onBack={handleBack} />

      <Content>
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

      <BottomArea>
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
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding-block: 1.25rem;
  min-height: 0;
  overflow-y: auto;
  margin-top: 2.44rem;
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
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.06rem;
  padding-inline: 0.94rem;
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
