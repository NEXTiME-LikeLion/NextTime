import styled from "styled-components";
import MenuItem from "./MenuItem";
import HomeIcon from "./icons/HomeIcon";
import PatternIcon from "./icons/PatternIcon";
import SettingIcon from "./icons/SettingIcon";

const menus = [
  { to: "/main", text: "홈", Icon: HomeIcon, end: true },
  { to: "/main/pattern", text: "패턴", Icon: PatternIcon },
  { to: "/main/settings", text: "설정", Icon: SettingIcon },
];

function BottomNavigation() {
  return (
    <NavContainer>
      {menus.map(({ to, text, Icon, end }) => (
        <MenuItem key={to} to={to} text={text} Icon={Icon} end={end} />
      ))}
    </NavContainer>
  );
}

export default BottomNavigation;

const NavContainer = styled.div`
  display: flex;
  width: 100%;
  height: 3.23rem;
  padding-top: 0.625rem;
  padding-bottom: var(--safe-bottom);
  align-items: flex-start;
  flex-shrink: 0;

  border-top: 0.669px solid rgba(44, 44, 48, 0.2);
  background: ${({ theme }) => theme.colors.white};
`;
