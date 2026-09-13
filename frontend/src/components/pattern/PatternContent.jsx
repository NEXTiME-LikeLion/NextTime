import * as S from "./PatternContent.styles";
import RecentChangeSection from "./sections/RecentChangeSection";
import HelpfulActionSection from "./sections/HelpfulActionSection";
import MemorableMomentSection from "./sections/MemorableMomentSection";

function PatternContent({ overview }) {
  const {
    insight,
    behaviorChange,
    effectiveActions = [],
    frequentTriggers = [],
  } = overview ?? {};

  return (
    <S.Container>
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
    </S.Container>
  );
}

export default PatternContent;
