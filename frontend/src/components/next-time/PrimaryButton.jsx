import styled from "styled-components";

function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
}) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      $variant={variant}
      $disabled={disabled}
    >
      {children}
    </Button>
  );
}

export default PrimaryButton;

const Button = styled.button`
  width: 100%;
  height: 3.5rem;
  border: none;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.2s ease;

  ${({ $variant, $disabled, theme }) => {
    if ($disabled) {
      return `
        background: rgba(247, 247, 250, 0.1);
        color: rgba(255, 255, 255, 0.4);
      `;
    }

    if ($variant === "primary") {
      return `
        background: ${theme.colors.primary};
        color: ${theme.colors.white};
      `;
    }

    if ($variant === "ghost") {
      return `
        background: rgba(247, 247, 250, 0.1);
        color: ${theme.colors.white};
      `;
    }

    return `
      background: rgba(247, 247, 250, 0.1);
      color: ${theme.colors.white};
    `;
  }}
`;
