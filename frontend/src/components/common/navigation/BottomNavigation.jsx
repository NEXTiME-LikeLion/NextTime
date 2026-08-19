import styled from "styled-components";
import MenuItem from "./MenuItem";
import HomeIcon from "./icons/HomeIcon";
import PatternIcon from "./icons/PatternIcon";
import SettingIcon from "./icons/SettingIcon";

const menus = [
  { to: "/main", text: "홈", Icon: HomeIcon, end: true },
  { to: "/main/pattern", text: "내 패턴", Icon: PatternIcon },
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

const NavContainer = styled.nav`
  display: flex;
  width: 100%;
  flex-shrink: 0;
  margin-top: auto;
  padding-top: 0.625rem;
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom, 0px));
  align-items: flex-start;
  box-sizing: border-box;
  border-top: 0.669px solid rgba(44, 44, 48, 0.2);
  background: ${({ theme }) => theme.colors.white};
`;
