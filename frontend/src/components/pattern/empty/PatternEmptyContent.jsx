import styled from "styled-components";
import mascotPattern from "../../../assets/mascot-pattern.svg";

function PatternEmptyContent({ recordCount, requiredCount }) {
  return (
    <Container>
      <Mascot src={mascotPattern} alt="" />
      <Message>
        기록이 5번 이상 누적되면
        <br />
        패턴을 알려드릴게요
      </Message>
      <ProgressBar>
        <Fill $ratio={recordCount / 5} />
      </ProgressBar>
      <CountText>현재 기록 {recordCount} / 5</CountText>
    </Container>
  );
}
export default PatternEmptyContent;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-inline: 3.81rem;
`;

const Mascot = styled.img`
  width: 9.125rem;
  height: 10.5rem;
  aspect-ratio: 73/84;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.bg1};
  text-align: center;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
`;

const ProgressBar = styled.div`
  width: 100%;
  display: flex;
  height: 0.5rem;
  align-items: center;
`;

const Fill = styled.div`
  border-radius: 6.25rem 0 0 6.25rem;
  background: ${({ theme }) => theme.colors.primary};
`;

const CountText = styled.p`
  color: var(--gray, #68686d);
  text-align: right;
  /* align-self: flex-end; */
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4rem;
`;
