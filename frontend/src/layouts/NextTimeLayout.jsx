import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import { NextTimeProvider } from "../contexts/NextTimeContext";

const SAFE_TOP = "max(var(--safe-top), env(safe-area-inset-top, 0px))";

function NextTimeLayout() {
  const { state } = useLocation();

  return (
    <NextTimeProvider initialSession={state?.session ?? null}>
      <LayoutContainer>
        <SafeTop />
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
  min-height: 0;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bg_black};
`;

const SafeTop = styled.div`
  flex-shrink: 0;
  height: ${SAFE_TOP};
`;
