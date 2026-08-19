import { useMemo, useState } from "react";
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
import { applyGoalUpdate, getNextMe, updateGoal } from "../../api/goal";
import { CHANGE_GOAL_LABEL_MAP } from "../../api/onboardingMappers";
import * as S from "./GoalPage.styles";

const DESIRED_CHANGE_OPTIONS = [
  { label: "완전히 끊고 싶어요", value: "QUIT" },
  { label: "우선 줄여가고 싶어요", value: "REDUCE" },
  { label: "아직 정하지 못했어요", value: "UNDECIDED" },
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

const getSheetValue = (key, goalData) => {
  if (!goalData) return "";

  switch (key) {
    case "changeGoal":
      return goalData.changeGoal || "";
    case "nextMe":
      return goalData.nextMe || "";
    case "motivation":
      return goalData.decisionTrigger || goalData.motivation || "";
    case "leftMessage":
      return goalData.leftMessage || "";
    default:
      return "";
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
  const { data, isLoading, error, refetch, setData } = useAsync(fetchNextMe);
  const {
    isLoading: isUpdating,
    error: updateError,
    execute: executeUpdate,
    refetch: retryUpdate,
  } = useAsync(updateGoal, { immediate: false });
  const [activeSheet, setActiveSheet] = useState(null);

  const mascotImage = useMemo(
    () => getMascotByTheme(data?.nextBudTheme),
    [data?.nextBudTheme],
  );

  const sheetConfig = {
    changeGoal: {
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

  const applyUpdatedGoal = (result) => {
    setData((prev) => applyGoalUpdate(prev, result));
  };

  const handleRetry = async () => {
    if (updateError) {
      console.log("나의 목표 수정을 다시 시도합니다.");
      const result = await retryUpdate();
      if (!result) {
        console.error("나의 목표 수정에 실패했습니다.");
        return;
      }
      console.log("나의 목표를 수정했습니다.", result);
      applyUpdatedGoal(result);
      return;
    }

    console.log("나의 목표 조회를 다시 시도합니다.");
    refetch();
  };

  const handleSubmit = (key) => async (newValue) => {
    if (isUpdating) return;

    const nextValue =
      key === "changeGoal" ? newValue : String(newValue ?? "").trim();

    if (key !== "changeGoal" && !nextValue) {
      console.error("나의 목표 수정에 실패했습니다. 수정할 값은 비어 있을 수 없습니다.");
      return;
    }

    if (nextValue === getSheetValue(key, data)) {
      console.log("수정할 목표 정보가 없어 요청을 건너뜁니다.", {
        key,
        nextValue,
      });
      return;
    }

    const body = { [key]: nextValue };
    console.log("나의 목표를 수정합니다.", body);
    const result = await executeUpdate(body);
    if (!result) {
      console.error("나의 목표 수정에 실패했습니다.");
      return;
    }

    console.log("나의 목표를 수정했습니다.", result);
    applyUpdatedGoal(result);
  };

  const currentConfig = activeSheet ? sheetConfig[activeSheet] : null;
  const showUpdateStatus = isUpdating || Boolean(updateError);

  return (
    <S.Wrapper>
      <BackHeader title="나의 목표" />

      <S.StatusArea>
        <ApiStatusView
          isLoading={(isLoading && !data) || isUpdating}
          error={!data ? error : updateError}
          onRetry={handleRetry}
          loadingTitle={
            isUpdating
              ? "나의 목표를 저장하는 중이에요"
              : "나의 목표를 불러오는 중이에요"
          }
          errorTitle={
            updateError
              ? "나의 목표를 저장하지 못했어요"
              : "불러오기에 실패했어요"
          }
        >
          {data ? (
            <S.Content>
              <S.FirstSectionLabel>현재 원하는 변화</S.FirstSectionLabel>
              <S.Row>
                <S.RowText>
                  {CHANGE_GOAL_LABEL_MAP[data.changeGoal] || data.changeGoal}
                </S.RowText>
                <S.EditButton onClick={() => setActiveSheet("changeGoal")}>
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
              <S.BodyText>{data.decisionTrigger}</S.BodyText>
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

      {currentConfig && !showUpdateStatus && (
        <EditSheet
          type={currentConfig.type}
          title={currentConfig.title}
          description={currentConfig.description}
          options={currentConfig.options}
          placeholder={currentConfig.placeholder}
          initialValue={getSheetValue(activeSheet, data)}
          onClose={() => setActiveSheet(null)}
          onSubmit={handleSubmit(activeSheet)}
        />
      )}
    </S.Wrapper>
  );
};

export default GoalPage;
