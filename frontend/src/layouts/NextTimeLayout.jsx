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
  background: ${({ theme }) => theme.colors.bg_black};
  padding-top: var(--safe-top);
`;
