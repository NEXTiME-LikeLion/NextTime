import styled from "styled-components";
import mascot from "../../assets/mascot.svg";
import mascotHealth from "../../assets/mascot-run.svg";
import mascotEconomy from "../../assets/mascot-economy.svg";
import mascotGrowth from "../../assets/mascot-growth.svg";
import mascotRelationship from "../../assets/mascot-relationship.svg";
import mascotSelfEfficacy from "../../assets/mascot-self-efficacy.svg";
import {useMemo} from "react";

function HomeHeader({ nextMe }) {
  const mascotImage = useMemo(() => {
    switch (nextMe?.nextBudTheme) {
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
  }, [nextMe?.nextBudTheme]);

  return (
    <>
      <TabName>홈</TabName>
      <Container>
        <TextBlock>
          <Block>
            <Label>NEXT ME</Label>
            <Title>{nextMe?.headline}</Title>
          </Block>
          <Block>
            <QuoteLabel>내가 남긴 말</QuoteLabel>
            <Quote>{nextMe?.messageToFutureSelf}</Quote>
          </Block>
        </TextBlock>
        <Mascot src={mascotImage} alt="Next Bud Mascot" />
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
  width: min(9.4375rem, 36vw);
  height: auto;
  max-height: 10.6875rem;
  aspect-ratio: 151 / 171;
  object-fit: contain;
  flex-shrink: 1;
  min-width: 0;
`;
