import { useEffect, useState } from "react";
import BackHeader from "../../components/common/BackHeader";
import Toast from "../../components/Toast/Toast";
import { useToast } from "../../contexts/ToastContext";
import CheckImg from "../../assets/check.svg";
import {
  getExcludedMissions,
  restoreMission,
} from "../../api/excludedMissions";
import * as S from "./ExcludePage.styles";

const ExcludePage = () => {
  const [excludedList, setExcludedList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast, showToast } = useToast();

  useEffect(() => {
    const fetchExcluded = async () => {
      try {
        const data = await getExcludedMissions();
        setExcludedList(data.excludedMissions);
      } catch (error) {
        console.error("추천 제외 목록 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExcluded();
  }, []);

  const handleRestore = async (mission) => {
    try {
      await restoreMission(mission.missionId);
      setExcludedList((prev) =>
        prev.filter((m) => m.missionId !== mission.missionId),
      );
      showToast(`'${mission.name}' 추천이 다시 포함됐어요`);
    } catch (error) {
      console.error("복구 실패:", error);
    }
  };

  if (isLoading) return null; // TODO: 로딩 스피너로 교체 가능

  return (
    <S.Wrapper>
      <BackHeader title="추천 제외 관리" />

      <S.Content>
        <S.SectionLabel>추천하지 않을 행동</S.SectionLabel>

        {excludedList.length > 0 ? (
          <S.ItemList>
            {excludedList.map((mission) => (
              <div key={mission.missionId}>
                <S.Item>
                  <S.ItemLabel>{mission.name}</S.ItemLabel>
                  <S.RestoreButton onClick={() => handleRestore(mission)}>
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
