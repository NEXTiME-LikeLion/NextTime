function MenuItem({ $active, MenuIcon, text }) {
  return (
    <MenuButton>
      <MenuIcon />
      <MenuText>text</MenuText>
    </MenuButton>
  );
}

export default MenuItem;

const MenuButton = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
`;

const MenuIcon = styled.div`
  width: 1.37488rem;
  height: 1.37488rem;
`;

const MenuText = styled.p`
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.default : "#68686D"};
  text-align: center;

  font-family: Pretendard;
  font-size: 0.625rem;
  font-style: normal;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  line-height: 0.9375rem; /* 150% */
  letter-spacing: -0.0125rem;
`;
