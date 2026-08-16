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
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.gray};
  background: rgba(247, 247, 250, 0.1);
  cursor: pointer;
  word-break: keep-all;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
  text-align: center;
`;
