import { useEffect, useMemo, useState } from "react";
import BackHeader from "../../components/common/BackHeader";
import EditSheet from "../../components/common/EditSheet";
import ApiStatusView from "../../components/common/ApiStatusView";
import useAsync from "../../hooks/useAsync";
import mascot from "../../assets/mascot.svg";
import mascotHealth from "../../assets/mascot-run.svg";
import mascotEconomy from "../../assets/mascot-economy.svg";
import mascotGrowth from "../../assets/mascot-growth.svg";
import mascotRelationship from "../../assets/mascot-relationship.svg";
import mascotSelfEfficacy from "../../assets/mascot-self-efficacy.svg";
import { getNextMe, updateChangeGoal, updateNextMe } from "../../api/goal";
import { CHANGE_GOAL_LABEL_MAP } from "../../api/onboardingMappers";
import * as S from "./GoalPage.styles";

const DESIRED_CHANGE_OPTIONS = [
  { label: "완전히 끊고 싶어요", value: "완전히 끊고 싶어요" },
  { label: "우선 줄여가고 싶어요", value: "우선 줄여가고 싶어요" },
  { label: "아직 정하지 못했어요", value: "아직 정하지 못했어요" },
];

const getMascotByTheme = (theme) => {
  switch (theme) {
    case "NEXTBUD_HEALTH_01":
      return mascotHealth;
    case "NEXTBUD_RELATIONSHIP_01":
      return mascotRelationship;
    case "NEXTBUD_ECONOMY_01":
      return mascotEconomy;
    case "NEXTBUD_SELF_EFFICACY_01":
      return mascotSelfEfficacy;
    case "NEXTBUD_GROWTH_01":
      return mascotGrowth;
    case "NEXTBUD_DEFAULT_01":
    default:
      return mascot;
  }
};

const fetchNextMe = async () => {
  console.log("나의 목표를 조회합니다.");
  try {
    const result = await getNextMe();
    console.log("나의 목표를 조회했습니다.", result);
    return result;
  } catch (error) {
    console.error("나의 목표 조회에 실패했습니다.");
    throw error;
  }
};

const GoalPage = () => {
  const { data, isLoading, error, refetch } = useAsync(fetchNextMe);
  const [fullAnswers, setFullAnswers] = useState(null);
  const [goal, setGoal] = useState({
    desiredChange: "",
    nextMe: "",
    motivation: "",
    leftMessage: "",
  });
  const [activeSheet, setActiveSheet] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("onboardingAnswers");
    if (saved) {
      const answers = JSON.parse(saved);
      setFullAnswers(answers);
      setGoal({
        desiredChange: answers.desiredChange || "",
        nextMe: answers.nextMe || "",
        motivation: answers.motivation || "",
        leftMessage: answers.leftMessage || "",
      });
    }
  }, []);

  const mascotImage = useMemo(
    () => getMascotByTheme(data?.nextBudTheme),
    [data?.nextBudTheme],
  );

  const sheetConfig = {
    desiredChange: {
      type: "radio",
      title: "어떤 변화를 원하시나요?",
      options: DESIRED_CHANGE_OPTIONS,
    },
    nextMe: {
      type: "textarea",
      title: "나의 NEXT ME 바꾸기",
      description:
        "앞으로 흡연 욕구가 올라올 때 떠올릴 나의 모습을 적어주세요.",
      placeholder: "러닝할 때 숨이 차서 먼저 멈추지 않는 나",
    },
    motivation: {
      type: "textarea",
      title: "나의 동기 수정하기",
      description: "금연을 하거나 흡연량을 줄이고 싶은 이유를 남겨주세요.",
      placeholder:
        "러닝을 꾸준히 하는데 숨이 먼저 차서 더 이상 기록이 늘지 않았어요.",
    },
    leftMessage: {
      type: "textarea",
      title: "내가 남긴 말 수정하기",
      description:
        "금연을 하거나 흡연량을 줄이기 시작할 때의 마음을 남겨주세요.",
      placeholder: '"러닝도 수영도, 내 체력 때문에 포기하고 싶지 않아."',
    },
  };

  const handleRetry = () => {
    console.log("나의 목표 조회를 다시 시도합니다.");
    refetch();
  };

  const handleSubmit = (key) => async (newValue) => {
    const updatedGoal = { ...goal, [key]: newValue };
    const updatedFullAnswers = { ...fullAnswers, [key]: newValue };

    setGoal(updatedGoal);
    setFullAnswers(updatedFullAnswers);
    localStorage.setItem(
      "onboardingAnswers",
      JSON.stringify(updatedFullAnswers),
    );

    try {
      if (key === "desiredChange") {
        await updateChangeGoal(updatedFullAnswers, newValue);
      } else {
        await updateNextMe(updatedFullAnswers);
      }
    } catch (saveError) {
      console.error("나의 목표 저장 실패:", saveError);
    }
  };

  const currentConfig = activeSheet ? sheetConfig[activeSheet] : null;

  return (
    <S.Wrapper>
      <BackHeader title="나의 목표" />

      <S.StatusArea>
        <ApiStatusView
          isLoading={isLoading && !data}
          error={!data ? error : null}
          onRetry={handleRetry}
          loadingTitle="나의 목표를 불러오는 중이에요"
        >
          {data ? (
            <S.Content>
              <S.FirstSectionLabel>현재 원하는 변화</S.FirstSectionLabel>
              <S.Row>
                <S.RowText>
                  {CHANGE_GOAL_LABEL_MAP[data.changeGoal] || data.changeGoal}
                </S.RowText>
                <S.EditButton onClick={() => setActiveSheet("desiredChange")}>
                  수정하기
                </S.EditButton>
              </S.Row>

              <S.Divider />

              <S.SectionLabel>나의 NEXT ME</S.SectionLabel>
              <S.NextMeCard>
                <S.NextMeLabel>NEXT ME</S.NextMeLabel>
                <S.NextMeText>{data.headline}</S.NextMeText>

                <S.NextMeSubLabel>내가 남긴 말</S.NextMeSubLabel>
                <S.NextMeSubText>{data.messageToFutureSelf}</S.NextMeSubText>

                <S.MascotImage src={mascotImage} alt="" />
              </S.NextMeCard>
              <S.EditButtonRight onClick={() => setActiveSheet("nextMe")}>
                수정하기
              </S.EditButtonRight>

              <S.Divider />

              <S.SectionLabel>나의 동기</S.SectionLabel>
              <S.BodyText>{data.startReason}</S.BodyText>
              <S.EditButtonRight onClick={() => setActiveSheet("motivation")}>
                수정하기
              </S.EditButtonRight>

              <S.Divider />

              <S.SectionLabel>내가 남긴 말</S.SectionLabel>
              <S.BodyText>"{data.messageToFutureSelf}"</S.BodyText>
              <S.EditButtonRight onClick={() => setActiveSheet("leftMessage")}>
                수정하기
              </S.EditButtonRight>
            </S.Content>
          ) : null}
        </ApiStatusView>
      </S.StatusArea>

      {currentConfig && (
        <EditSheet
          type={currentConfig.type}
          title={currentConfig.title}
          description={currentConfig.description}
          options={currentConfig.options}
          placeholder={currentConfig.placeholder}
          initialValue={goal[activeSheet]}
          onClose={() => setActiveSheet(null)}
          onSubmit={handleSubmit(activeSheet)}
        />
      )}
    </S.Wrapper>
  );
};

export default GoalPage;
