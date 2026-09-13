import { useState } from "react";
import PatternHero from "../components/pattern/PatternHero";
import PatternContent from "../components/pattern/PatternContent";
import ReductionChangeSheet from "../components/pattern/ReductionChangeSheet";
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
  const [isChangeSheetOpen, setIsChangeSheetOpen] = useState(false);

  const recordCount = data?.records?.length ?? 0;
  const isPreparing = recordCount < REQUIRED_PATTERN_RECORDS;

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
              <PatternContent
                report={READY_PATTERN_REPORT}
                onChangeCardClick={() => setIsChangeSheetOpen(true)}
              />
            </S.ReportBackdrop>
          </S.ReportStage>
        )}
      </S.ScrollBody>
      <ReductionChangeSheet
        isOpen={isChangeSheetOpen}
        onClose={() => setIsChangeSheetOpen(false)}
        report={READY_PATTERN_REPORT}
      />
    </S.Screen>
  );
}

export default PatternPage;
