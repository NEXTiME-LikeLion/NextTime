import styled from "styled-components";
import RecentChangeSection from "./sections/RecentChangeSection";
import HelpfulActionSection from "./sections/HelpfulActionSection";
import MemorableMomentSection from "./sections/MemorableMomentSection";
import RecentRecordsSection from "./sections/RecentRecordsSection";

function PatternContent({ overview }) {
  const {
    insight,
    behaviorChange,
    effectiveActions = [],
    frequentTriggers = [],
    recentRecords = [],
  } = overview ?? {};

  return (
    <Container>
      {behaviorChange ? (
        <RecentChangeSection behaviorChange={behaviorChange} />
      ) : null}
      {effectiveActions.length > 0 ? (
        <HelpfulActionSection actions={effectiveActions} />
      ) : null}
      {frequentTriggers.length > 0 ? (
        <MemorableMomentSection
          triggers={frequentTriggers}
          topTimeSlot={insight?.topTimeSlot}
        />
      ) : null}
      <RecentRecordsSection records={recentRecords} />
    </Container>
  );
}

export default PatternContent;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-top: 2rem;
  padding-bottom: 2rem;
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

  & > *:last-child {
    padding-bottom: 0;
  }
`;
