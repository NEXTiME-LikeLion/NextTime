import styled from "styled-components";

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
`;

export const Title = styled.p`
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
`;

export const CompareRow = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  width: 100%;
`;

export const WeekCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ $empty }) => ($empty ? "space-between" : "center")};
  gap: ${({ $empty }) => ($empty ? "0" : "0.375rem")};
  width: 8rem;
  min-height: 5rem;
  padding: ${({ $empty, $tone }) =>
    $empty ? "1rem 0.375rem 0.375rem" : $tone === "current" ? "1rem" : "1rem 0.75rem"};
  border-radius: 0.75rem;
  text-align: center;
  overflow: hidden;

  ${({ $tone, theme }) =>
    $tone === "current"
      ? `
    color: ${theme.colors.primary};
    background: #fafdfc;
    border: 0.025rem solid ${theme.colors.primary};
    box-shadow: 0.125rem 0 0.309375rem rgba(0, 185, 107, 0.08);
  `
      : `
    color: ${theme.colors.gray};
    background: rgba(178, 178, 178, 0.04);
  `}
`;

export const WeekCardLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
`;

export const WeekCardValue = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
  white-space: nowrap;
`;

export const WeekCardEmpty = styled.p`
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
`;

export const Trend = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const TrendIcon = styled.img`
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
`;

export const TrendLabel = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
  white-space: nowrap;
`;

export const ChartTitle = styled.p`
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.4;
`;

export const Chart = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.875rem;
  width: 100%;
  height: 11rem;
  padding: 2.0625rem 1.25rem 0.75rem;
  border-radius: 1.125rem;
  background: #fbfbfb;
`;

export const AverageLabel = styled.p`
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  color: #9ca3a1;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
`;

export const Plot = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
`;

export const AverageLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${({ $offset }) => $offset};
  border-top: 0.0625rem dashed rgba(178, 178, 178, 0.32);
  pointer-events: none;
`;

export const BarStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.3125rem;
  width: 1.375rem;
`;

export const BarValue = styled.p`
  width: 100%;
  color: ${({ $highlight, theme }) =>
    $highlight ? theme.colors.primary : "#69696e"};
  font-size: 0.6875rem;
  font-weight: ${({ $highlight }) => ($highlight ? 700 : 500)};
  line-height: normal;
  text-align: center;
`;

export const Bar = styled.div`
  width: 100%;
  height: ${({ $height }) => `${$height / 16}rem`};
  border-radius: 0.375rem;
  background: ${({ $empty, $highlight, theme }) =>
    $empty ? "#e8edeb" : $highlight ? theme.colors.primary : "#eef7f3"};
`;

export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
`;

export const DayLabel = styled.p`
  width: 1.375rem;
  color: ${({ $highlight, theme }) =>
    $highlight ? theme.colors.primary : "#9ca3a1"};
  font-size: 0.6875rem;
  font-weight: ${({ $highlight }) => ($highlight ? 700 : 400)};
  line-height: normal;
  text-align: center;
`;

export const Insight = styled.p`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 2.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: rgba(178, 178, 178, 0.1);
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
`;
