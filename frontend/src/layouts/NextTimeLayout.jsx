import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { NextTimeProvider } from "../contexts/NextTimeContext";

function NextTimeLayout() {
  return (
    <NextTimeProvider>
      <LayoutContainer>
        <Outlet />
      </LayoutContainer>
    </NextTimeProvider>
  );
}

export default NextTimeLayout;

const LayoutContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme.colors.bg_black};
  overflow: hidden;
`;
