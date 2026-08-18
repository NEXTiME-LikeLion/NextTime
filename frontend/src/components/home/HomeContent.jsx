import UrgeActionSection from "./UrgeActionSection";
import TodayChangeSection from "./TodayChangeSection";
import styled from "styled-components";
import usePatternSummary from "../hooks/usePatternSummary";

function HomeContent() {
  const { isReady } = usePatternSummary();

  if (!isReady) {
    return (
    <Container>
      <UrgeActionSection />
    </Container>
    );
  }

  return (
    <Container>
      <UrgeActionSection />
      <TodayChangeSection />
    </Container>
  );
}
export default HomeContent;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 2rem;
  padding-block: 1.75rem;
  min-height: 100%;
`;
