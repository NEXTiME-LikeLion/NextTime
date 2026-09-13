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

export const BestCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  padding: 0.875rem 2rem 0.875rem 1rem;
  border-radius: 1.125rem;
  background: #fafdfc;
`;

export const BestImageBox = styled.div`
  width: 3.75rem;
  height: 5.25rem;
  flex-shrink: 0;
  overflow: hidden;
`;

export const BestImage = styled.img`
  display: block;
  width: 3.75rem;
  height: 5.25rem;
  object-fit: contain;
`;

export const BestMeta = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

export const BestLabel = styled.p`
  color: #9ca3a1;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
`;

export const BestRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
`;

export const BestName = styled.p`
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
`;

export const Dash = styled.div`
  flex: 1;
  min-width: 0.625rem;
  height: 0;
  border-top: 0.0625rem dashed #d8dedb;
`;

export const BestRate = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
  text-align: right;
  white-space: nowrap;
`;

export const BestCaption = styled.p`
  color: ${({ theme }) => theme.colors.gray};
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
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 1.125rem;
  background: #fbfbfb;
`;

export const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const RowLead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
`;

export const Rank = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  white-space: nowrap;
`;

export const RowImageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.875rem;
  height: 2.5rem;
  flex-shrink: 0;
  overflow: hidden;
`;

export const RowImage = styled.img`
  display: block;
  width: 1.875rem;
  height: 2.5rem;
  object-fit: contain;
`;

export const RowName = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  white-space: nowrap;
`;

export const RowMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  flex-shrink: 0;
`;

export const Track = styled.div`
  position: relative;
  width: 5.75rem;
  height: 0.5rem;
  border-radius: 0.25rem;
  background: #ecf1ef;
  overflow: hidden;
`;

export const Fill = styled.div`
  width: ${({ $percent }) => `${Math.min(Math.max($percent, 0), 100)}%`};
  height: 100%;
  border-radius: 0.25rem;
  background: rgba(0, 213, 121, 0.2);
`;

export const Rate = styled.p`
  width: 2.125rem;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  text-align: right;
`;

export const Fraction = styled.p`
  width: 2rem;
  color: ${({ theme }) => theme.colors.light_gray};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  text-align: right;
`;

export const Footnote = styled.p`
  color: ${({ theme }) => theme.colors.light_gray};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
`;
