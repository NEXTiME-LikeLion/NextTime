import styled from "styled-components";

function PrimaryButton({ children, onClick, type = "button" }) {
  return (
    <Button type={type} onClick={onClick}>
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
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  cursor: pointer;
`;
