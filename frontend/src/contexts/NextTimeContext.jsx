import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { MOCK_RECOMMENDATION } from "../data/nextTimeMock";

const NextTimeContext = createContext(null);

const initialRecordAnswers = {
  howDidYouDo: null,
  currentIntensity: null,
  missionFeedback: null,
  additionalNote: "",
};

export const NextTimeProvider = ({ children }) => {
  const [situationIntensity, setSituationIntensity] = useState(null);
  const [location, setLocation] = useState(null);
  const [moment, setMoment] = useState(null);
  const [recommendedMission, setRecommendedMission] = useState(
    MOCK_RECOMMENDATION,
  );
  const [recordAnswers, setRecordAnswers] = useState(initialRecordAnswers);

  const updateRecordAnswer = useCallback((key, value) => {
    setRecordAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFlow = useCallback(() => {
    setSituationIntensity(null);
    setLocation(null);
    setMoment(null);
    setRecommendedMission(MOCK_RECOMMENDATION);
    setRecordAnswers(initialRecordAnswers);
  }, []);

  const value = useMemo(
    () => ({
      situationIntensity,
      location,
      moment,
      recommendedMission,
      recordAnswers,
      setSituationIntensity,
      setLocation,
      setMoment,
      setRecommendedMission,
      setRecordAnswers,
      updateRecordAnswer,
      resetFlow,
    }),
    [
      situationIntensity,
      location,
      moment,
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
