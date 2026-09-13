import BottomSheet from "../common/BottomSheet";
import { getEasySituations } from "./patternReport";
import * as S from "./EasySituationSheet.styles";

function formatRate(value) {
  return `${value}%`;
}

function formatFraction(success, total) {
  if (success == null || total == null) return "";
  return `${success}/${total}`;
}

function EasySituationSheet({ isOpen, onClose, report }) {
  const data = getEasySituations(report);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <S.Header>
        <S.Title>감연하기 쉬운 상황</S.Title>
        <S.Subtitle>바로 피우지 않은 비율을 상황별로 비교했어요</S.Subtitle>
      </S.Header>

      {data.best ? (
        <S.BestCard>
          <S.BestLabel>가장 줄이기 쉬운 상황</S.BestLabel>
          <S.BestRow>
            <S.BestName>{data.best.name}</S.BestName>
            <S.Dash />
            <S.BestRate>{formatRate(data.best.rate)}</S.BestRate>
          </S.BestRow>
          {data.best.caption ? (
            <S.BestCaption>{data.best.caption}</S.BestCaption>
          ) : null}
        </S.BestCard>
      ) : null}

      <S.Section>
        <S.SectionTitle>상황별 비교</S.SectionTitle>
        <S.Chart>
          <S.Rows>
            {data.items.map((item, index) => {
              const best = index === 0;

              return (
                <S.Row key={item.name}>
                  <S.RowName $best={best}>{item.name}</S.RowName>
                  <S.RowMeta>
                    <S.Track>
                      <S.Fill $percent={item.rate} $best={best} />
                    </S.Track>
                    <S.Rate $best={best}>{formatRate(item.rate)}</S.Rate>
                    <S.Fraction>
                      {formatFraction(item.success, item.total)}
                    </S.Fraction>
                  </S.RowMeta>
                </S.Row>
              );
            })}
          </S.Rows>
          <S.Footnote>
            오른쪽 숫자 = 바로 피우지 않은 횟수 / 해당 순간 기록 수
          </S.Footnote>
        </S.Chart>
      </S.Section>
    </BottomSheet>
  );
}

export default EasySituationSheet;
