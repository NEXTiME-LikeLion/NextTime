import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  mapContextAnswersFromSession,
  mapMissionFromSession,
} from "../api/nextTime";
import { MOCK_RECOMMENDATION } from "../data/nextTimeMock";

const NextTimeContext = createContext(null);

const initialRecordAnswers = {
  howDidYouDo: null,
  currentIntensity: null,
  missionFeedback: null,
  additionalNote: "",
};

export const NextTimeProvider = ({ children, initialSession = null }) => {
  const initialContext = mapContextAnswersFromSession(initialSession);
  const [session, setSession] = useState(initialSession);
  const [situationIntensity, setSituationIntensity] = useState(
    initialContext.situationIntensity,
  );
  const [location, setLocation] = useState(initialContext.location);
  const [moment, setMoment] = useState(initialContext.moment);
  const [futureVoice, setFutureVoice] = useState(null);
  const [recommendedMissionState, setRecommendedMission] = useState(
    () => mapMissionFromSession(initialSession) ?? MOCK_RECOMMENDATION,
  );
  const [recordAnswers, setRecordAnswers] = useState(initialRecordAnswers);

  const recommendedMission = useMemo(
    () => mapMissionFromSession(session) ?? recommendedMissionState,
    [recommendedMissionState, session],
  );

  const updateRecordAnswer = useCallback((key, value) => {
    setRecordAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFlow = useCallback(() => {
    setSession(null);
    setSituationIntensity(null);
    setLocation(null);
    setMoment(null);
    setFutureVoice(null);
    setRecommendedMission(MOCK_RECOMMENDATION);
    setRecordAnswers(initialRecordAnswers);
  }, []);

  const value = useMemo(
    () => ({
      session,
      sessionId: session?.sessionId ?? null,
      situationIntensity,
      location,
      moment,
      futureVoice,
      recommendedMission,
      recordAnswers,
      setSession,
      setSituationIntensity,
      setLocation,
      setMoment,
      setFutureVoice,
      setRecommendedMission,
      setRecordAnswers,
      updateRecordAnswer,
      resetFlow,
    }),
    [
      session,
      situationIntensity,
      location,
      moment,
      futureVoice,
      recommendedMission,
      recordAnswers,
      updateRecordAnswer,
      resetFlow,
    ],
  );

  return (
    <NextTimeContext.Provider value={value}>{children}</NextTimeContext.Provider>
  );
};

export const useNextTime = () => {
  const context = useContext(NextTimeContext);
  if (!context) {
    throw new Error(
      "useNextTime는 NextTimeProvider 안에서만 사용할 수 있어요.",
    );
  }
  return context;
};
