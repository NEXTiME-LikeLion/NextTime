import styled from "styled-components";
import MascotCharacter from "./MascotCharacter";

function OptionCard({ label, mood = "neutral", selected = false, onClick }) {
  return (
    <Card
      type="button"
      $selected={selected}
      onClick={onClick}
      aria-pressed={selected}
    >
      <MascotCharacter mood={mood} size="sm" />
      <Label>{label}</Label>
    </Card>
  );
}

export default OptionCard;

const Card = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  min-height: 2.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: ${({ $selected, theme }) =>
    $selected
      ? `2px solid ${theme.colors.primary}`
      : `1px solid ${theme.colors.gray}`};
  background: ${({ $selected }) =>
    $selected ? `rgba(0, 213, 121, 0.8)` : `rgba(247, 247, 250, 0.1)`};
  cursor: pointer;
  word-break: keep-all;
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  font-weight: ${({ $selected }) => ($selected ? 700 : 400)};
  line-height: 1.4;
  text-align: center;
`;
