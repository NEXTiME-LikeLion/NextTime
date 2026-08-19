import { Outlet } from "react-router-dom";
import styled from "styled-components";
import logoSvg from "../assets/logo2.svg";

export const AuthLayout = ({ logoMarginTop = 140, bottomPadding = 40 }) => {
  return (
    <PageWrapper>
      <Container $bottomPadding={bottomPadding}>
        <Header $marginTop={logoMarginTop}>
          <LogoImage src={logoSvg} alt="NEXTIME" />
        </Header>

        <Main>
          <Outlet />
        </Main>
      </Container>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.bg.default};
`;

const Container = styled.div`
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.bg.surface};
  padding: ${({ $bottomPadding }) => `0 14px ${$bottomPadding}px`};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  @media (min-width: 431px) {
    min-height: 844px;
    border-radius: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
`;

const StatusBarImage = styled.img`
  width: 402px;
  height: 62px;
  display: block;
  align-self: center;
  flex-shrink: 0;
`;

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${({ $marginTop }) => $marginTop}px;
  margin-bottom: 80px;
`;

const LogoImage = styled.img`
  width: 160px;
  height: auto;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export default AuthLayout;
