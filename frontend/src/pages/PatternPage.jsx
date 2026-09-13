import PatternHero from "../components/pattern/PatternHero";
import PatternContent from "../components/pattern/PatternContent";
import heroBackground from "../assets/pattern/hero-background.png";
import emptyBackground from "../assets/pattern/empty-background.png";
import useAsync from "../hooks/useAsync";
import useRefetchOnVisit from "../hooks/useRefetchOnVisit";
import { getRecords } from "../api/record";
import {
  REQUIRED_PATTERN_RECORDS,
  READY_PATTERN_REPORT,
} from "../components/pattern/patternReport";
import * as S from "./PatternPage.styles";

function PatternPage() {
  const { data, refetch, isLoading } = useAsync(() =>
    getRecords(REQUIRED_PATTERN_RECORDS),
  );
  useRefetchOnVisit(refetch);

  const recordCount = data?.records?.length ?? 0;
  // const isPreparing = recordCount < REQUIRED_PATTERN_RECORDS;
  const isPreparing = true;

  if (isLoading && !data) return null;

  return (
    <S.Screen>
      {isPreparing ? (
        <S.EmptyBackground>
          <S.EmptyImage src={emptyBackground} alt="" />
        </S.EmptyBackground>
      ) : (
        <S.HeroBackground>
          <S.HeroImage src={heroBackground} alt="" />
          <S.HeroFade />
        </S.HeroBackground>
      )}
      <S.SafeTop />
      <S.ScrollBody $lockScroll={isPreparing}>
        <PatternHero
          isPreparing={isPreparing}
          recordCount={recordCount}
          weeklyLabel={READY_PATTERN_REPORT.reductionLabel}
        />
        {isPreparing ? null : (
          <S.ReportStage>
            <S.ReportBackdrop>
              <PatternContent report={READY_PATTERN_REPORT} />
            </S.ReportBackdrop>
          </S.ReportStage>
        )}
      </S.ScrollBody>
    </S.Screen>
  );
}

export default PatternPage;
