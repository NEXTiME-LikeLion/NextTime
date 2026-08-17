import styled from "styled-components";
import mascotPattern from "../../assets/mascot-pattern.svg";
import PatternTopBlock from "./PatternTopBlock";

function BoldText({ text }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <Bold key={i}>{part.slice(2, -2)}</Bold>
        ) : (
          part
        ),
      )}
    </>
  );
}

function PatternHeader() {
  // TODO: API 연동 시 교체
  const myPattern = {
    title: "퇴근 직후에 가장 흔들렸어요",
    subTitle: "기록한 욕구 8번 중 5번, 특히 흡연구역 근처에서 강했어요",
    solution: "흡연구역에서 먼저 벗어나보세요!",
    similarPattern:
      "비슷한 상황에서 장소를 옮긴 **3번 중 2번**은 바로 흡연으로 이어지지 않았어요",
  };

  return (
    <>
      <PatternTopBlock />

      <MiddleBlock>
        <TextBlock>
          <Label>이번 주 패턴</Label>
          <Title>{myPattern.title}</Title>
          <SubTitle>{myPattern.subTitle}</SubTitle>
        </TextBlock>
        <Mascot src={mascotPattern} alt="" />
      </MiddleBlock>

      <BottomBlock>
        <Solution>
          이럴땐 <Emphasis>{myPattern.solution}</Emphasis>
        </Solution>
        <SimilarPattern>
          <BoldText text={myPattern.similarPattern} />
        </SimilarPattern>
      </BottomBlock>
    </>
  );
}

export default PatternHeader;

const MiddleBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2.25rem;
  padding-bottom: 0.5rem;
  margin-top: 0.37rem;
`;

const TextBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  justify-content: flex-start;
  margin-top: 0.13rem;
  line-height: 1.4;
  word-break: keep-all;
`;

const Label = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.75rem;
  font-weight: 700;
`;

const Title = styled.p`
  color: ${({ theme }) => theme.colors.bg0};
  font-size: 1.5rem;
  font-weight: 700;
`;

const SubTitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 400;
`;

const Mascot = styled.img`
  width: 8.9375rem;
  height: 8.4375rem;
  object-fit: contain;
  flex-shrink: 0;
`;

const BottomBlock = styled.div`
  max-width: 100%;
  border-top: 1px solid rgba(254, 254, 254, 0.2);
  padding-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  word-break: keep-all;
`;

const Solution = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
`;

const Emphasis = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
`;

const SimilarPattern = styled.p`
  max-width: 15rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
`;

const Bold = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 700;
`;
