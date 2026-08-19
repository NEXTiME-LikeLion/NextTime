import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import { NextTimeProvider } from "../contexts/NextTimeContext";

function NextTimeLayout() {
  const { state } = useLocation();

  return (
    <NextTimeProvider initialSession={state?.session ?? null}>
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
  min-height: 0;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bg_black};
  padding-top: max(var(--safe-top), env(safe-area-inset-top, 0px));
  padding-bottom: max(var(--safe-bottom), env(safe-area-inset-bottom, 0px));
`;
