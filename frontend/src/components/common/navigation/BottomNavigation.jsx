import styled from "styled-components";
import MenuItem from "./MenuItem";

function BottomNavigation() {
  return (
    <NavContainer>
      <MenuItem />
      <MenuItem />
      <MenuItem />
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
