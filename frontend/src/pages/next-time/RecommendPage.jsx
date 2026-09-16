import * as S from "./RecommendPage.styles";
import { useNavigate } from "react-router-dom";
import { useElementHeight } from "../../hooks/useElementHeight";
import { useNextTime } from "../../contexts/NextTimeContext";
import useAsync from "../../hooks/useAsync";
import useNextTimeStatusRedirect from "../../hooks/useNextTimeStatusRedirect";
import {
  getNextTimePathByStatus,
  isNextTimeStatusAfter,
  mapStartedMission,
  startNextTimeMission,
} from "../../api/nextTime";
import Header from "../../components/next-time/Header";
import CircularTimer from "../../components/next-time/CircularTimer";
import PrimaryButton from "../../components/next-time/PrimaryButton";
import useSkipNextTimeMission from "../../hooks/useSkipNextTimeMission";
import useRewindNextTimeSession from "../../hooks/useRewindNextTimeSession";

function splitMissionTitle(title) {
  if (!title) return [""];
  const splitIndex = title.search(/\d+분/);
  if (splitIndex > 0) {
    return [title.slice(0, splitIndex).trim(), title.slice(splitIndex).trim()];
  }
  return [title];
}

function RecommendPage() {
  const navigate = useNavigate();
  const {
    session,
    sessionId,
    recommendedMission,
    setSession,
    setRecommendedMission,
  } = useNextTime();
  useNextTimeStatusRedirect("MISSION_RECOMMENDED");
  const {
    title = "",
    description = "",
    durationSeconds = 0,
  } = recommendedMission ?? {};
  const titleLines = splitMissionTitle(title);
  const { isLoading: isStarting, execute } = useAsync(startNextTimeMission, {
    immediate: false,
  });
  const { skip, isLoading: isSkipping } = useSkipNextTimeMission({
    isBusy: isStarting,
  });
  const { rewind, isLoading: isRewinding } = useRewindNextTimeSession({
    isBusy: isStarting || isSkipping,
  });
  const isLoading = isStarting || isSkipping || isRewinding;

  const [bottomAreaRef, bottomAreaHeight] = useElementHeight();

  const goToMission = (startedSession) => {
    if (startedSession) {
      setSession((prev) => ({ ...(prev ?? {}), ...startedSession }));

      if (startedSession.mission) {
        const mission = mapStartedMission(startedSession);
        setRecommendedMission((prev) => ({ ...prev, ...mission }));
        console.log("미션 수행 화면으로 이동합니다.", { mission });
      }
    }
    navigate("/next-time/mission", { replace: true });
  };

  const startMission = async () => {
    if (isLoading) return;

    if (!sessionId) {
      console.error("세션 ID가 없어 미션을 시작할 수 없습니다.");
      return;
    }

    if (isNextTimeStatusAfter(session?.status, "MISSION_RECOMMENDED")) {
      const path = getNextTimePathByStatus(session.status);
      console.log("세션이 이미 미션 추천 이후 단계라 미션 시작을 건너뜁니다.", {
        sessionId,
        status: session.status,
        path,
        session,
      });
      if (session.status === "MISSION_STARTED") {
        goToMission(session);
        return;
      }
      navigate(path, { replace: true });
      return;
    }

    console.log("미션을 시작합니다.", { sessionId });
    const result = await execute(sessionId);
    if (!result) {
      console.error("미션 시작에 실패했습니다.");
      return;
    }

    console.log("미션을 시작했습니다.", {
      sessionId: result.sessionId,
      status: result.status,
      mission: result.mission,
      startedAt: result.startedAt,
      result,
    });
    goToMission(result);
  };

  const handleSkip = () => {
    skip();
  };

  const handleBack = () => {
    if (isLoading) return;
    rewind();
  };

  return (
    <S.PageContainer>
      <Header title="NEXT TIME" back={false} />

      <S.Content $bottomAreaHeight={bottomAreaHeight}>
        <S.MissionTitle>
          {titleLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </S.MissionTitle>

        <CircularTimer
          totalSeconds={durationSeconds}
          remainingSeconds={durationSeconds}
        />

        <S.Description>{description}</S.Description>
      </S.Content>

      <S.BottomArea ref={bottomAreaRef}>
        <PrimaryButton
          variant="primary"
          disabled={isLoading}
          onClick={startMission}
        >
          시작하기
        </PrimaryButton>
        <S.SkipButton type="button" disabled={isLoading} onClick={handleSkip}>
          건너뛰기
        </S.SkipButton>
      </S.BottomArea>
    </S.PageContainer>
  );
}

export default RecommendPage;
