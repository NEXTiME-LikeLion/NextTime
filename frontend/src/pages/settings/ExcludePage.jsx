import { useState } from "react";
import BackHeader from "../../components/common/BackHeader";
import Toast from "../../components/Toast/Toast";
import { useToast } from "../../contexts/ToastContext";
import CheckImg from "../../assets/check.svg";
import * as S from "./ExcludePage.styles";

const INITIAL_EXCLUDED = [
  { id: 1, label: "호흡 가다듬기" },
  { id: 2, label: "누군가와 이야기하기" },
];

const ExcludePage = () => {
  const [excludedList, setExcludedList] = useState(INITIAL_EXCLUDED);
  const { toast, showToast } = useToast();

  const handleRestore = (item) => {
    setExcludedList((prev) => prev.filter((i) => i.id !== item.id));
    showToast(`'${item.label}' 추천이 다시 포함됐어요`);
  };

  return (
    <S.Wrapper>
      <BackHeader title="추천 제외 관리" />

      <S.Content>
        <S.SectionLabel>추천하지 않을 행동</S.SectionLabel>

        {excludedList.length > 0 ? (
          <S.ItemList>
            {excludedList.map((item, index) => (
              <div key={item.id}>
                <S.Item>
                  <S.ItemLabel>{item.label}</S.ItemLabel>
                  <S.RestoreButton onClick={() => handleRestore(item)}>
                    다시 추천받기
                  </S.RestoreButton>
                </S.Item>
                <S.Divider />
              </div>
            ))}
          </S.ItemList>
        ) : (
          <S.EmptyContent>
            <S.EmptyCenterBlock>
              <S.EmptyIconWrapper>
                <S.EmptyImage src={CheckImg} alt="" />
              </S.EmptyIconWrapper>

              <S.EmptyTitle>아직 제외한 행동이 없어요</S.EmptyTitle>
              <S.EmptyDescription>
                사용하면서 나와 맞지 않는 행동을
                <br />
                하나씩 알아갈게요
              </S.EmptyDescription>
            </S.EmptyCenterBlock>

            <S.FooterDivider />

            <S.FooterNote>
              NEXT TIME를 사용하면서 나와 맞지 않는 행동은
              <br />
              결과 기록에서 추천을 줄일 수 있어요.
            </S.FooterNote>
          </S.EmptyContent>
        )}
      </S.Content>

      {toast && <Toast message={toast.message} />}
    </S.Wrapper>
  );
};

export default ExcludePage;
