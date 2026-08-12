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
  background-color: ${({ theme }) => theme.colors.primary.default};
  padding: var(--safe-top) 1.25rem 0 1.25rem;
`;

const Header = styled.div`
  padding-bottom: 1rem;
`;

const Content = styled.div`
  border-radius: 1rem 1rem 0 0;
  background-color: ${({ theme }) => theme.colors.bg.surface};
`;
