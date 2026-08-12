import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import logoSvg from "../assets/logo2.svg";
import statusBarImg from "../assets/statusbar.svg";

export const AuthLayout = () => {
  return (
    <PageWrapper>
      <Container>
        <StatusBarImage src={statusBarImg} alt="" />

        <Header>
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
  width: 100vw;
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
  padding: 0 14px 40px;
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
  margin-top: 140px;
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
