import styled from "styled-components";

function TabMainLayout({ header, content, scrollEntirePage = false }) {
  return (
    <ScreenContainer $scrollEntirePage={scrollEntirePage}>
      <Header>{header}</Header>
      <Content $scrollEntirePage={scrollEntirePage}>{content}</Content>
    </ScreenContainer>
  );
}

export default TabMainLayout;

const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  overflow: ${({ $scrollEntirePage }) => ($scrollEntirePage ? "auto" : "hidden")};

  ${({ $scrollEntirePage }) =>
    $scrollEntirePage &&
    `
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  `}
`;

const Header = styled.div`
  padding: var(--safe-top) 1.25rem 1rem 1.25rem;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: ${({ $scrollEntirePage }) => ($scrollEntirePage ? "auto" : "0")};
  border-radius: 1rem 1rem 0 0;
  background-color: ${({ theme }) => theme.colors.bg0};
  padding-inline: 1.25rem;
  overflow-y: ${({ $scrollEntirePage }) =>
    $scrollEntirePage ? "visible" : "auto"};
`;
