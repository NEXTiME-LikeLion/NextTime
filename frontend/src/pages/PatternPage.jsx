import { useState } from "react";
import PatternHero from "../components/pattern/PatternHero";
import PatternContent from "../components/pattern/PatternContent";
import ReductionChangeSheet from "../components/pattern/ReductionChangeSheet";
import SmokingTimeSheet from "../components/pattern/SmokingTimeSheet";
import EasySituationSheet from "../components/pattern/EasySituationSheet";
import HelpfulActionSheet from "../components/pattern/HelpfulActionSheet";
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
  const [openSheet, setOpenSheet] = useState(null);

  const recordCount = data?.records?.length ?? 0;
  const isPreparing = recordCount < REQUIRED_PATTERN_RECORDS;
  const closeSheet = () => setOpenSheet(null);

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
                onChangeCardClick={() => setOpenSheet("change")}
                onTimeCardClick={() => setOpenSheet("time")}
                onSituationCardClick={() => setOpenSheet("situation")}
                onActionCardClick={() => setOpenSheet("action")}
              />
            </S.ReportBackdrop>
          </S.ReportStage>
        )}
      </S.ScrollBody>
      <ReductionChangeSheet
        isOpen={openSheet === "change"}
        onClose={closeSheet}
        report={READY_PATTERN_REPORT}
      />
      <SmokingTimeSheet
        isOpen={openSheet === "time"}
        onClose={closeSheet}
        report={READY_PATTERN_REPORT}
      />
      <EasySituationSheet
        isOpen={openSheet === "situation"}
        onClose={closeSheet}
        report={READY_PATTERN_REPORT}
      />
      <HelpfulActionSheet
        isOpen={openSheet === "action"}
        onClose={closeSheet}
        report={READY_PATTERN_REPORT}
      />
    </S.Screen>
  );
}

export default PatternPage;
