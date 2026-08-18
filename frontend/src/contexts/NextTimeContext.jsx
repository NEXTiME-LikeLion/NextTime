import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { MOCK_RECOMMENDATION } from "../data/nextTimeMock";

const NextTimeContext = createContext(null);

const initialRecordAnswers = {
  howDidYouDo: null,
  currentIntensity: null,
  missionFeedback: null,
  additionalNote: "",
};

export const NextTimeProvider = ({ children, initialSession = null }) => {
  const [session, setSession] = useState(initialSession);
  const [situationIntensity, setSituationIntensity] = useState(null);
  const [location, setLocation] = useState(null);
  const [moment, setMoment] = useState(null);
  const [futureVoice, setFutureVoice] = useState(null);
  const [recommendedMission, setRecommendedMission] = useState(
    MOCK_RECOMMENDATION,
  );
  const [recordAnswers, setRecordAnswers] = useState(initialRecordAnswers);

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
