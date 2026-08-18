import UrgeActionSection from "./UrgeActionSection";
import TodayChangeSection from "./TodayChangeSection";
import styled from "styled-components";

function HomeContent() {
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
