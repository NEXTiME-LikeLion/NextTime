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
import { getPatternOverview } from "../api/pattern";
import { mapApiToReport } from "../components/pattern/patternReport";
import * as S from "./PatternPage.styles";

function PatternPage() {
  const { data, refetch, isLoading } = useAsync(getPatternOverview);
  useRefetchOnVisit(refetch);
  const [openSheet, setOpenSheet] = useState(null);

  const isPreparing = data?.dataStatus !== "AVAILABLE";
  const report = data ? mapApiToReport(data) : null;
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
          recordCount={data?.completedResultCount ?? 0}
          weeklyLabel={report?.reductionLabel ?? ""}
        />
        {isPreparing ? null : (
          <S.ReportStage>
            <S.ReportBackdrop>
              <PatternContent
                report={report}
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
        report={report}
      />
      <SmokingTimeSheet
        isOpen={openSheet === "time"}
        onClose={closeSheet}
        report={report}
      />
      <EasySituationSheet
        isOpen={openSheet === "situation"}
        onClose={closeSheet}
        report={report}
      />
      <HelpfulActionSheet
        isOpen={openSheet === "action"}
        onClose={closeSheet}
        report={report}
      />
    </S.Screen>
  );
}

export default PatternPage;