import styled from "styled-components";

function BottomNavigation() {
  return (
    <NavContainer>
      <Button />
      <Button />
      <Button />
    </NavContainer>
  );
}

export default BottomNavigation;

const NavContainer = styled.div`
  display: flex;
  width: 100%;
  height: 5rem;
  padding-top: 0.625rem;
  align-items: flex-start;
  flex-shrink: 0;

  border-top: 0.669px solid rgba(44, 44, 48, 0.2);
  background: #fff;
`;

const Button = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
`;
