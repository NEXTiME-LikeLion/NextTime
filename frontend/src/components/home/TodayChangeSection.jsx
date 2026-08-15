import { useNavigate } from "react-router-dom";
import ProgressIndicator from "./ProgressIndicator";
import rightArrow from "../../assets/right-arrow.svg";
import styled from "styled-components";

function TodayChangeSection() {
  const navigate = useNavigate();
  // TODO: API 연동 시 교체
  const todayChange = {
    overcomeCount: 3,
    totalCount: 5,
    postponeCount: 1,
    smokeCount: 1,
    dots: ["overcome", "overcome", "overcome", "postpone", "smoke"], // 5개
    nextAction: {
      title: "흡연구역에서 벗어나 걷기",
      description: "오늘은 자리를 옮겼을 때 흡연 욕구를 가장 잘 넘겼어요.",
    },
  };

  return (
    <Section>
      <SectionTitle>오늘의 변화</SectionTitle>

      <Card
        onClick={() => navigate("/pattern")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate("/pattern");
          }
        }}
      >
        <TopRow>
          <StatBlock>
            <StatCount>
              <Strong>{todayChange.overcomeCount}</Strong>
              <Muted> / {todayChange.totalCount}</Muted>
            </StatCount>
            <StatLabel>기록한 욕구를 넘겼어요</StatLabel>
          </StatBlock>
          <Chevron src={rightArrow} alt="" aria-hidden="true" />
        </TopRow>

        <MiddleRow>
          <ProgressIndicator dots={todayChange.dots} />
          <Summary>
            넘김 {todayChange.overcomeCount} · 미룸 {todayChange.postponeCount}{" "}
            · 흡연 {todayChange.smokeCount}
          </Summary>
        </MiddleRow>

        <Divider />

        <NextActionBlock>
          <NextActionLabel>다음해도 해볼 행동</NextActionLabel>
          <NextActionTitle>{todayChange.nextAction.title}</NextActionTitle>
          <NextActionDesc>{todayChange.nextAction.description}</NextActionDesc>
        </NextActionBlock>
      </Card>
    </Section>
  );
}

export default TodayChangeSection;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionTitle = styled.h3`
  color: #000;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 1.25rem;
  background: rgba(178, 178, 178, 0.04);
  cursor: pointer;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;

  &:hover {
    opacity: 0.98;
  }

  &:active {
    transform: scale(0.995);
    opacity: 0.96;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatCount = styled.p`
  line-height: 1.4;
`;

const Strong = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 800;
  font-size: 2rem;
  font-style: normal;
  font-weight: 800;
`;

const Muted = styled.span`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 1.125rem;
  font-weight: 700;
`;

const StatLabel = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
`;

const Chevron = styled.img`
  width: 0.5rem;
  height: 0.875rem;
  aspect-ratio: 4/7;
  object-fit: contain;
  display: block;
`;

const MiddleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Summary = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(178, 178, 178, 0.3);
  margin: 0;
`;

const NextActionBlock = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.bg1};
  line-height: 1.4;
`;

const NextActionLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const NextActionTitle = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const NextActionDesc = styled.p`
  font-size: 0.875rem;
  font-weight: 400;
`;
