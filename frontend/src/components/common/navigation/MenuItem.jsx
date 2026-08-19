import { NavLink } from "react-router-dom";
import styled from "styled-components";

function MenuItem({ to, Icon, text, end }) {
  return (
    <MenuLink to={to} end={end}>
      <MenuButton>
        <MenuIcon>
          <Icon />
        </MenuIcon>
        <MenuText>{text}</MenuText>
      </MenuButton>
    </MenuLink>
  );
}

export default MenuItem;

const MenuLink = styled(NavLink)`
  flex: 1;
  color: ${({ theme }) => theme.colors.gray};
  font-weight: 400;
  text-decoration: none;

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }
`;

const MenuButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const MenuIcon = styled.span`
  width: 1.375rem;
  height: 1.375rem;
`;

const MenuText = styled.p`
  text-align: center;
  font-size: 0.625rem;
  line-height: 0.9375rem; /* 150% */
  letter-spacing: -0.0125rem;
`;
