import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChipButton from "../../components/common/ChipButton";
import BackHeader from "../../components/common/BackHeader";
import { ONBOARDING_STEPS } from "./onboardingSteps";
import * as S from "./OnboardingPage.styles";

const CUSTOM_INPUT_LABEL = "+ 직접 입력하기";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [customInputs, setCustomInputs] = useState({});
  const [focusedKey, setFocusedKey] = useState(null);

  const step = ONBOARDING_STEPS[stepIndex];
  const totalSteps = ONBOARDING_STEPS.length;
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  const isStepValid = step.questions.every((q) => {
    const value = answers[q.key];
    if (q.type === "multi") return Array.isArray(value) && value.length > 0;
    if (q.type === "text") return true;
    return !!value;
  });

  const handleSelect = (key, option, multi, maxSelect) => {
    setAnswers((prev) => {
      if (multi) {
        const current = prev[key] || [];
        const alreadySelected = current.includes(option);

        if (!alreadySelected && maxSelect && current.length >= maxSelect) {
          return prev;
        }

        const next = alreadySelected
          ? current.filter((v) => v !== option)
          : [...current, option];
        return { ...prev, [key]: next };
      }
      return { ...prev, [key]: option };
    });
  };

  const handleCustomInputChange = (key, text) => {
    setCustomInputs((prev) => ({ ...prev, [key]: text }));
  };

  const handleNext = () => {
    if (!isStepValid) return;
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
    } else {
      navigate("/onboarding/loading");
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
    else navigate(-1);
  };

  return (
    <>
      <BackHeader
        rightContent={`${stepIndex + 1} / ${totalSteps}`}
        onBack={handleBack}
      />

      <S.ProgressBarTrack>
        <S.ProgressBarFill $progress={progress} />
      </S.ProgressBarTrack>

      <S.Wrapper>
        <S.Title>
          {step.title.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < step.title.split("\n").length - 1 && <br />}
            </span>
          ))}
        </S.Title>

        {step.questions.map((q) => (
          <S.QuestionBlock key={q.key}>
            <S.QuestionLabel>{q.label}</S.QuestionLabel>
            {q.note && <S.QuestionNote>{q.note}</S.QuestionNote>}

            {q.type === "text" ? (
              <S.TextArea
                placeholder={q.placeholder}
                value={answers[q.key] || ""}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))
                }
                onFocus={() => setFocusedKey(q.key)}
                onBlur={() => setFocusedKey(null)}
                $focused={focusedKey === q.key}
                $filled={(answers[q.key] || "").trim().length > 0}
                $height={q.textareaHeight}
              />
            ) : (
              <>
                {q.layout === "grid" ? (
                  <S.ChipGrid>
                    {q.options.map((opt) => (
                      <ChipButton
                        key={opt}
                        label={opt}
                        selected={
                          q.type === "multi"
                            ? (answers[q.key] || []).includes(opt)
                            : answers[q.key] === opt
                        }
                        onClick={() =>
                          handleSelect(
                            q.key,
                            opt,
                            q.type === "multi",
                            q.maxSelect,
                          )
                        }
                      />
                    ))}
                  </S.ChipGrid>
                ) : (
                  <S.ChipGroup>
                    {q.options.map((opt) =>
                      q.allowCustomInput &&
                      opt === CUSTOM_INPUT_LABEL &&
                      (answers[q.key] || []).includes(CUSTOM_INPUT_LABEL) ? (
                        <S.TextArea
                          key={opt}
                          placeholder="도움을 주는 행동을 직접 작성해주세요"
                          value={customInputs[q.key] || ""}
                          onChange={(e) =>
                            handleCustomInputChange(q.key, e.target.value)
                          }
                          onFocus={() => setFocusedKey(`${q.key}-custom`)}
                          onBlur={() => setFocusedKey(null)}
                          $focused={focusedKey === `${q.key}-custom`}
                          $filled={
                            (customInputs[q.key] || "").trim().length > 0
                          }
                          $height={52}
                        />
                      ) : (
                        <ChipButton
                          key={opt}
                          label={opt}
                          selected={
                            q.type === "multi"
                              ? (answers[q.key] || []).includes(opt)
                              : answers[q.key] === opt
                          }
                          onClick={() =>
                            handleSelect(
                              q.key,
                              opt,
                              q.type === "multi",
                              q.maxSelect,
                            )
                          }
                        />
                      ),
                    )}
                  </S.ChipGroup>
                )}
              </>
            )}
          </S.QuestionBlock>
        ))}

        <S.NextButton disabled={!isStepValid} onClick={handleNext}>
          {stepIndex < totalSteps - 1 ? "다음" : "완료"}
        </S.NextButton>
      </S.Wrapper>
    </>
  );
};

export default OnboardingPage;
