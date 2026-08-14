// src/pages/settings/GoalPage.jsx
import { useState } from "react";
import BackHeader from "../../components/common/BackHeader";
import EditSheet from "../../components/common/EditSheet";
import mascotRunImg from "../../assets/mascot-run.svg";
import * as S from "./GoalPage.styles";

const DESIRED_CHANGE_OPTIONS = [
  { label: "완전히 끊고 싶어요", value: "완전히 끊고 싶어요" },
  { label: "우선 줄여가고 싶어요", value: "우선 줄여가고 싶어요" },
  { label: "아직 정하지 못했어요", value: "아직 정하지 못했어요" },
];

const GoalPage = () => {
  const [goal, setGoal] = useState({
    desiredChange: "완전히 끊고 싶어요",
    nextMe: "러닝할 때 숨이 차서 먼저 멈추지 않는 나",
    motivation:
      "러닝을 꾸준히 하는데 숨이 먼저 차서 더 이상 기록이 늘지 않는 것 같았어요.",
    leftMessage: "러닝도 수영도, 내 체력 때문에 포기하고 싶지 않아.",
  });

  const [activeSheet, setActiveSheet] = useState(null);

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
        "러닝을 꾸준히 하는데 숨이 먼저 차서 더 이상 기록이 늘지 않는 것 같았어요.",
    },
    leftMessage: {
      type: "textarea",
      title: "내가 남긴 말 수정하기",
      description:
        "금연을 하거나 흡연량을 줄이기 시작할 때의 마음을 남겨주세요.",
      placeholder: '"러닝도 수영도, 내 체력 때문에 포기하고 싶지 않아."',
    },
  };

  const handleSubmit = (key) => (newValue) => {
    setGoal((prev) => ({ ...prev, [key]: newValue }));
  };

  const currentConfig = activeSheet ? sheetConfig[activeSheet] : null;

  return (
    <S.Wrapper>
      <BackHeader title="나의 목표" />

      <S.Content>
        <S.FirstSectionLabel>현재 원하는 변화</S.FirstSectionLabel>
        <S.Row>
          <S.RowText>{goal.desiredChange}</S.RowText>
          <S.EditButton onClick={() => setActiveSheet("desiredChange")}>
            수정하기
          </S.EditButton>
        </S.Row>

        <S.Divider />

        <S.SectionLabel>나의 NEXT ME</S.SectionLabel>
        <S.NextMeCard>
          <S.NextMeLabel>NEXT ME</S.NextMeLabel>
          <S.NextMeText>{goal.nextMe}</S.NextMeText>

          <S.NextMeSubLabel>내가 남긴 말</S.NextMeSubLabel>
          <S.NextMeSubText>{goal.leftMessage}</S.NextMeSubText>

          <S.MascotImage src={mascotRunImg} alt="" />
        </S.NextMeCard>
        <S.EditButtonRight onClick={() => setActiveSheet("nextMe")}>
          수정하기
        </S.EditButtonRight>

        <S.Divider />

        <S.SectionLabel>나의 동기</S.SectionLabel>
        <S.BodyText>{goal.motivation}</S.BodyText>
        <S.EditButtonRight onClick={() => setActiveSheet("motivation")}>
          수정하기
        </S.EditButtonRight>

        <S.Divider />

        <S.SectionLabel>내가 남긴 말</S.SectionLabel>
        <S.BodyText>"{goal.leftMessage}"</S.BodyText>
        <S.EditButtonRight onClick={() => setActiveSheet("leftMessage")}>
          수정하기
        </S.EditButtonRight>
      </S.Content>

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
