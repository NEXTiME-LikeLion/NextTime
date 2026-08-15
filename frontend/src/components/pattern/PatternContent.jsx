import styled from "styled-components";
import RecentChangeSection from "./sections/RecentChangeSection";
import HelpfulActionSection from "./sections/HelpfulActionSection";
import MemorableMomentSection from "./sections/MemorableMomentSection";
import RecentRecordsSection from "./sections/RecentRecordsSection";

function PatternContent() {
  return (
    <Container>
      <RecentChangeSection />
      <HelpfulActionSection />
      <MemorableMomentSection />
      <RecentRecordsSection />
    </Container>
  );
}

export default PatternContent;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-block: 2rem;
  min-height: 100%;

  /* 두 번째 자식부터 모두 */
  & > * + * {
    padding-top: 1.25rem;
    padding-bottom: 1.75rem;
  }

  /* 마지막 자식 빼고 모두 */
  & > *:not(:last-child) {
    border-bottom: 1px solid rgba(178, 178, 178, 0.2);
  }
`;
