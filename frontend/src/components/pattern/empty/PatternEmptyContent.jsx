import styled from "styled-components";
import mascot from "../../../assets/mascot.svg";

function PatternEmptyContent({ recordCount, requiredCount }) {
  const ratio = requiredCount > 0 ? recordCount / requiredCount : 0;

  return (
    <Container>
      <Hero>
        <Mascot src={mascot} alt="" />
        <Message>
          기록이 {requiredCount}번 이상 누적되면
          <br />
          패턴을 알려드릴게요
        </Message>
      </Hero>
      <ProgressBlock>
        <ProgressBar>
          <Fill $ratio={ratio} />
        </ProgressBar>
        <CountText>
          현재 기록 {recordCount} / {requiredCount}
        </CountText>
      </ProgressBlock>
    </Container>
  );
}
export default PatternEmptyContent;

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.25rem;
  width: 100%;
  min-height: 100%;
  padding-inline: 1.3125rem;
`;

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 11.25rem;
`;

const Mascot = styled.img`
  width: 9.125rem;
  height: 10.5rem;
  aspect-ratio: 73/84;
  object-fit: contain;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.bg1};
  text-align: center;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
`;

const ProgressBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  overflow: hidden;
  border-radius: 6.25rem;
  background: rgba(178, 178, 178, 0.2);
`;

const Fill = styled.div`
  height: 100%;
  width: ${({ $ratio }) => `${Math.min(Math.max($ratio, 0), 1) * 100}%`};
  border-radius: 6.25rem 0 0 6.25rem;
  background: ${({ theme }) => theme.colors.primary};
`;

const CountText = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  text-align: right;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
`;
