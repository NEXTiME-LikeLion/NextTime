import styled from "styled-components";

function OptionChip({
  label,
  selected = false,
  onClick,
  fullWidth = false,
}) {
  return (
    <Chip
      type="button"
      $selected={selected}
      $fullWidth={fullWidth}
      onClick={onClick}
      aria-pressed={selected}
    >
      {label}
    </Chip>
  );
}

export default OptionChip;

const Chip = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  min-width: 2.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.gray};
  background: rgba(247, 247, 250, 0.1);
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
  cursor: pointer;
  word-break: keep-all;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;
