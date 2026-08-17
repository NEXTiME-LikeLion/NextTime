import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useNextTime } from "../../contexts/NextTimeContext";
import Header from "../../components/next-time/Header";
import CircularTimer from "../../components/next-time/CircularTimer";
import WhyThisBox from "../../components/next-time/WhyThisBox";

function splitMissionTitle(title) {
  const splitIndex = title.search(/\d+분/);
  if (splitIndex > 0) {
    return [title.slice(0, splitIndex).trim(), title.slice(splitIndex).trim()];
  }
  return [title];
}

function MissionPage() {
  const navigate = useNavigate();
  const { recommendedMission } = useNextTime();
  const { title, missionDescription, durationSeconds, whyThisText } =
    recommendedMission;
  const titleLines = splitMissionTitle(title);
  const missionDescriptionLines = missionDescription?.split("\n") ?? [];

  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      navigate("/next-time/record", { replace: true });
    }
  }, [remainingSeconds, navigate]);

  const handleBack = () => {
    navigate("/next-time/recommend", { replace: true });
  };

  const handleSkip = () => {
    navigate("/next-time/record", { replace: true });
  };

  return (
    <PageContainer>
      <Header title="NEXT TIME" onBack={handleBack} />

      <AllContent>
        <Box>
          <Content>
            <StatusLabel>미션 진행 중</StatusLabel>

            <MissionTitle>
              {titleLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </MissionTitle>

            <CircularTimer
              totalSeconds={durationSeconds}
              remainingSeconds={Math.max(0, remainingSeconds)}
              showRemainingLabel
            />

            <Description>
              {missionDescriptionLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </Description>
          </Content>

          {whyThisText && <WhyThisBox text={whyThisText} />}
        </Box>

        <BottomArea>
          <SkipButton type="button" onClick={handleSkip}>
            건너뛰기
          </SkipButton>
        </BottomArea>
      </AllContent>
    </PageContainer>
  );
}

export default MissionPage;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding-inline: 1.25rem;
`;

const AllContent = styled.div`
  overflow-y: auto;
`;

const Box = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding-block: 1.25rem;
  min-height: 0;
  margin-top: 2.44rem;
`;

const StatusLabel = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
`;

const MissionTitle = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
  word-break: keep-all;

  p {
    margin: 0;
  }
`;

const Description = styled.div`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
  word-break: keep-all;

  p {
    margin: 0;
  }
`;

const BottomArea = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  margin-bottom: 2.06rem;
  padding-inline: 0.94rem;
  background: transparent;

  & > button {
    opacity: 0.92;
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
