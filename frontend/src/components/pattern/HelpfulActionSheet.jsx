import BottomSheet from "../common/BottomSheet";
import { getHelpfulActions } from "./patternReport";
import * as S from "./HelpfulActionSheet.styles";

const BEST_IMAGE_WIDTH = 60;
const BEST_IMAGE_HEIGHT = 84;
const ROW_IMAGE_WIDTH = 30;
const ROW_IMAGE_HEIGHT = 40;

function formatRate(value) {
  return `${value}%`;
}

function formatFraction(success, total) {
  if (success == null || total == null) return "";
  return `${success}/${total}`;
}

function HelpfulActionSheet({ isOpen, onClose, report }) {
  const data = getHelpfulActions(report);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <S.Header>
        <S.Title>감연에 도움이 된 추천 행동</S.Title>
        <S.Subtitle>
          흡연 생각을 줄이는 데 잘 맞았던 행동을 확인해요
        </S.Subtitle>
      </S.Header>

      {data.best ? (
        <S.BestCard>
          <S.BestImageBox>
            <S.BestImage
              src={data.best.image}
              alt=""
              width={BEST_IMAGE_WIDTH}
              height={BEST_IMAGE_HEIGHT}
            />
          </S.BestImageBox>
          <S.BestMeta>
            <S.BestLabel>가장 잘 맞는 행동</S.BestLabel>
            <S.BestRow>
              <S.BestName>{data.best.name}</S.BestName>
              <S.Dash />
              <S.BestRate>{formatRate(data.best.rate)}</S.BestRate>
            </S.BestRow>
            {data.best.caption ? (
              <S.BestCaption>{data.best.caption}</S.BestCaption>
            ) : null}
          </S.BestMeta>
        </S.BestCard>
      ) : null}

      <S.Section>
        <S.SectionTitle>추천 행동별 비교</S.SectionTitle>
        <S.Chart>
          <S.Rows>
            {data.others.map((item, index) => (
              <S.Row key={item.name}>
                <S.RowLead>
                  <S.Rank>{index + 2}</S.Rank>
                  <S.RowImageBox>
                    <S.RowImage
                      src={item.image}
                      alt=""
                      width={ROW_IMAGE_WIDTH}
                      height={ROW_IMAGE_HEIGHT}
                    />
                  </S.RowImageBox>
                  <S.RowName>{item.name}</S.RowName>
                </S.RowLead>
                <S.RowMeta>
                  <S.Track>
                    <S.Fill $percent={item.rate} />
                  </S.Track>
                  <S.Rate>{formatRate(item.rate)}</S.Rate>
                  <S.Fraction>
                    {formatFraction(item.success, item.total)}
                  </S.Fraction>
                </S.RowMeta>
              </S.Row>
            ))}
          </S.Rows>
          <S.Footnote>
            오른쪽 숫자 = 욕구 감소 횟수 / 해당 추천 행동 실행 횟수
          </S.Footnote>
        </S.Chart>
      </S.Section>
    </BottomSheet>
  );
}

export default HelpfulActionSheet;
