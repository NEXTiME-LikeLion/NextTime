import styled, { css } from "styled-components";

const SAFE_TOP = "max(var(--safe-top), env(safe-area-inset-top, 0px))";

const hideScrollbar = css`
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

function TabMainLayout({ header, content, scrollEntirePage = false }) {
  return (
    <ScreenContainer>
      <SafeTop />
      <ScrollBody $scrollEntirePage={scrollEntirePage}>
        <Header>{header}</Header>
        <Content $scrollEntirePage={scrollEntirePage}>{content}</Content>
      </ScrollBody>
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
  overflow: hidden;
`;

const SafeTop = styled.div`
  flex-shrink: 0;
  height: ${SAFE_TOP};
`;

const ScrollBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: ${({ $scrollEntirePage }) => ($scrollEntirePage ? "auto" : "hidden")};

  ${({ $scrollEntirePage }) => $scrollEntirePage && hideScrollbar}
`;

const Header = styled.div`
  flex-shrink: 0;
  padding: 0 max(1.25rem, var(--safe-right), env(safe-area-inset-right, 0px))
    1rem max(1.25rem, var(--safe-left), env(safe-area-inset-left, 0px));
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: ${({ $scrollEntirePage }) => ($scrollEntirePage ? "auto" : "0")};
  border-radius: 1rem 1rem 0 0;
  background-color: ${({ theme }) => theme.colors.bg0};
  padding-inline: max(1.25rem, var(--safe-left), env(safe-area-inset-left, 0px))
    max(1.25rem, var(--safe-right), env(safe-area-inset-right, 0px));
  overflow-y: ${({ $scrollEntirePage }) =>
    $scrollEntirePage ? "visible" : "auto"};
`;
