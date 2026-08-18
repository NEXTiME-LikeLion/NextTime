import styled from "styled-components";

function TabMainLayout({ header, content }) {
  return (
    <ScreenContainer>
      <Header>{header}</Header>
      <Content>{content}</Content>
    </ScreenContainer>
  );
}

export default TabMainLayout;

const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary};
  overflow-y: auto;
`;

const Header = styled.div`
  padding: var(--safe-top) 1.25rem 1rem 1.25rem;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-radius: 1rem 1rem 0 0;
  background-color: ${({ theme }) => theme.colors.bg0};
  padding-inline: 1.25rem;
`;
