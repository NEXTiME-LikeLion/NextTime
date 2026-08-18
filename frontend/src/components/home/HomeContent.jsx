import UrgeActionSection from "./UrgeActionSection";
import TodayChangeSection from "./TodayChangeSection";
import styled from "styled-components";

function HomeContent({ todaySummary, onSmokingRecorded }) {
  const hasTodayRecords = (todaySummary?.totalAttemptCount ?? 0) > 0;

  return (
    <Container>
      <UrgeActionSection onSmokingRecorded={onSmokingRecorded} />
      {hasTodayRecords && <TodayChangeSection todaySummary={todaySummary} />}
    </Container>
  );
}
export default HomeContent;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 2rem;
  padding-top: 1.75rem;
  padding-bottom: 4rem;
  min-height: 100%;
`;
