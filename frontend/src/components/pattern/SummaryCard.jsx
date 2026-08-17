import styled from "styled-components";

function SummaryCard({ title, overcomeCount, totalCount, variant = "before" }) {
  return (
    <Card $variant={variant}>
      <Title $variant={variant}>{title}</Title>
      <Count $variant={variant}>
        {overcomeCount} / {totalCount}
      </Count>
    </Card>
  );
}

export default SummaryCard;

const Card = styled.div`
  display: flex;
  padding: 0.75rem 1.5rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.125rem;
  border-radius: 0.75rem;
  background: ${({ $variant, theme }) =>
    $variant === "after"
      ? "rgba(0, 213, 121, 0.1)"
      : "rgba(178, 178, 178, 0.1)"};
  color: ${({ $variant, theme }) =>
    $variant === "after" ? theme.colors.primary : theme.colors.gray};
`;

const Title = styled.p`
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: inherit;
`;

const Count = styled.p`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: inherit;
`;
