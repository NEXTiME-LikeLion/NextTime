import styled from "styled-components";

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
  padding: 0 2rem;
`;

export const PeakCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ $empty }) => ($empty ? "space-between" : "center")};
  width: 8rem;
  min-height: 5rem;
  padding: ${({ $empty }) => ($empty ? "0.5rem 0.375rem 1rem" : "0.5rem 0")};
  border-radius: 0.75rem;
  text-align: center;
  overflow: hidden;

  ${({ $tone, theme }) =>
    $tone === "current"
      ? `
    color: ${theme.colors.primary};
    background: #fafdfc;
    border: 0.0625rem solid ${theme.colors.primary};
  `
      : `
    color: ${theme.colors.gray};
    background: rgba(178, 178, 178, 0.04);
  `}
`;

export const PeakLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
`;

export const PeakSlot = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
`;

export const PeakCount = styled.p`
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  color: ${({ $tone }) => ($tone === "current" ? "inherit" : "#9ca3a1")};
`;

export const PeakEmpty = styled.p`
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`;

export const SectionTitle = styled.p`
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.4;
`;

export const Chart = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  padding: 1.25rem 1rem;
  border-radius: 1.125rem;
  background: #fbfbfb;
`;

export const Plot = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
`;

export const BarCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  width: 1.875rem;
`;

export const BarStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.125rem;
  width: 100%;
`;

export const BarValue = styled.p`
  width: 100%;
  color: ${({ $peak, theme }) =>
    $peak ? theme.colors.primary : theme.colors.gray};
  font-size: 0.75rem;
  font-weight: ${({ $peak }) => ($peak ? 700 : 400)};
  line-height: 1.4;
  text-align: center;
`;

export const Bar = styled.div`
  width: 100%;
  height: ${({ $height }) => `${$height / 16}rem`};
  border-radius: 0.375rem;
  background: ${({ $peak, theme }) =>
    $peak ? theme.colors.primary : "#eef7f3"};
`;

export const BarLabel = styled.p`
  width: 100%;
  color: ${({ $peak, theme }) => ($peak ? theme.colors.primary : "#9ca3a1")};
  font-size: 0.625rem;
  font-weight: ${({ $peak }) => ($peak ? 700 : 400)};
  line-height: normal;
  text-align: center;
  white-space: nowrap;
`;

export const WeekBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 1.125rem;
  background: #fbfbfb;
`;

export const WeekRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  width: 100%;
`;

export const WeekPill = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  width: 2.625rem;
  padding: 0.25rem 0;
  border-radius: 0.625rem;
  background: rgba(238, 247, 243, 0.62);
  text-align: center;
`;

export const WeekDay = styled.p`
  color: #9ca3a1;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
`;

export const WeekHour = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
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
