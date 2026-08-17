import styled from "styled-components";
import mascotHome from "../../assets/mascot-home.svg";

// TODO: API 연동 시 교체
const NEXT_ME = {
  title: "러닝할 때 숨이 차서 먼저 멈추지 않는 나",
  quote: "러닝도 수영도, 내 체력 때문에 포기하고 싶지 않아.",
};

function HomeHeader() {
  return (
    <>
      <TabName>홈</TabName>
      <Container>
        <TextBlock>
          <Block>
            <Label>NEXT ME</Label>
            <Title>{NEXT_ME.title}</Title>
          </Block>
          <Block>
            <QuoteLabel>내가 남긴 말</QuoteLabel>
            <Quote>{NEXT_ME.quote}</Quote>
          </Block>
        </TextBlock>
        <Mascot src={mascotHome} alt="" />
      </Container>
    </>
  );
}

export default HomeHeader;

const TabName = styled.p`
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.4;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1.375rem;
  padding-bottom: 1rem;
  padding-top: 0.5rem;
`;

const TextBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  margin-top: 0.22rem;
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.p`
  color: ${({ theme }) => theme.colors.bg0};
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.4;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
  word-break: keep-all;
`;

const QuoteLabel = styled.p`
  color: ${({ theme }) => theme.colors.bg0};
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
`;

const Quote = styled.p`
  color: ${({ theme }) => theme.colors.bg0};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
  word-break: keep-all;
  margin-right: 0.63rem;
`;

const Mascot = styled.img`
  width: 9.4375rem;
  height: 10.6875rem;
  object-fit: contain;
  flex-shrink: 0;
`;
