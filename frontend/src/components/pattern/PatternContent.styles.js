import styled from "styled-components";

export const Cards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

export const Card = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  border-radius: 1.25rem;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 0 3.75rem 0.1875rem rgba(0, 185, 107, 0.04);
`;

const ClickableCard = styled(Card).attrs({
  as: "button",
  type: "button",
})`
  border: none;
  text-align: left;
  cursor: pointer;
  font: inherit;
  color: inherit;
`;

export const ChangeCard = styled(ClickableCard)`
  gap: 1rem;
  padding: 1rem 1.0625rem;
`;

export const TimeCard = styled(ClickableCard)`
  min-height: 11.125rem;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.25rem;
`;

export const SituationCard = styled(ClickableCard)`
  min-height: 15.5rem;
  padding: 1rem 1.25rem 1rem;
`;

export const ActionCard = styled(ClickableCard)`
  gap: 0.5rem;
  align-items: center;
  padding: 1rem 1.25rem;
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
`;

export const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const Label = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
`;

export const HighlightValue = styled.p`
  color: #00b96b;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
`;

export const Title = styled.p`
  color: ${({ theme }) => theme.colors.bg_black};
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
`;

export const Caption = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
`;

export const TipBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 2.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: rgba(178, 178, 178, 0.1);
`;

export const TipText = styled.p`
  color: #00b96b;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
`;

export const PeakBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.1875rem 0.5rem;
  border-radius: 0.75rem;
  background: #e8faf1;
  color: #00b96b;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  white-space: nowrap;
`;

export const Chart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  width: 100%;
  max-width: 19.5625rem;
`;

export const Bars = styled.div`
  position: relative;
  width: 100%;
`;

export const Bar = styled.div`
  position: absolute;
  bottom: 0;
  width: 1rem;
  height: ${({ $height }) => `${$height / 16}rem`};
  border-radius: 0.4375rem;
  background: ${({ $peak, theme }) =>
    $peak ? theme.colors.primary : "#dde5e1"};
  transform: translateX(-50%);
`;


export const Axis = styled.div`
  position: relative;
  width: 100%;
  height: 1.775rem;
  padding-top: 0.5rem;

  &::before {
    content: "";
    position: absolute;
    top: 1.4rem;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #e5e6ec;
  }
`;

export const AxisLabel = styled.span`
  position: absolute;
  top: 0.9rem;
  z-index: 2;
  width: fit-content;
  transform: translateX(-50%);
  color: #8b9490;
  background-color: ${({ theme }) => theme.colors.white};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  text-align: center;
  padding: 0 0.15rem;
`;

export const AxisTick = styled.div`
  position: relative;
  z-index: 2;
  flex: 1;
  align-self: stretch;
`;

export const AxisTickLine = styled.div`
  position: absolute;
  top: 1.2rem;
  width: 1px;
  height: 0.375rem;
  background-color: #d9dedb;
  transform: translateX(-50%);
`;

export const GaugeBlock = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 0.25rem;
`;

export const GaugeSvg = styled.svg`
  display: block;
  width: 11.25rem;
  height: 6.25rem;
`;

export const GaugeCenter = styled.div`
  position: absolute;
  top: 2.4rem;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
`;

export const GaugePercent = styled.p`
  color: #00b96b;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
`;

export const GaugeRank = styled.p`
  color: #7c8581;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
`;

export const RankRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 0.75rem;
`;

export const RankPill = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 10.5rem;
  padding: 0.625rem 0.75rem;;
  border-radius: 0.75rem;
  background: rgba(178, 178, 178, 0.1);
  color: #7c8581;
  font-size: 0.8125rem;
  line-height: 1.4;
  white-space: nowrap;
`;

export const RankOrder = styled.span`
  font-weight: 400;
`;

export const RankName = styled.span`
  font-weight: 600;
`;

export const RankValue = styled.span`
  font-weight: 400;
`;

export const ActionList = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
`;

export const ActionItem = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  height: 10.25rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: ${({ $first }) =>
    $first ? "rgba(0, 213, 121, 0.06)" : "rgba(178, 178, 178, 0.1)"};
`;

export const ActionImageBox = styled.div`
  width: 4.5rem;
  height: ${({ $height }) => `${$height / 16}rem`};
  overflow: hidden;
  flex-shrink: 0;
  border-radius: 1.25rem;
`;

export const ActionImage = styled.img`
  display: block;
  width: 4.5rem;
  height: ${({ $height }) => `${$height / 16}rem`};
  object-fit: contain;
`;

export const ActionMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: ${({ $first, theme }) => ($first ? theme.colors.primary : "#7c8581")};
  font-size: 0.75rem;
  line-height: 1.4;
  white-space: nowrap;
`;

export const ActionRank = styled.p`
  font-weight: 400;
`;

export const ActionName = styled.p`
  font-weight: ${({ $first }) => ($first ? 700 : 400)};
`;