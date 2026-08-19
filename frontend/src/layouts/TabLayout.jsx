import { Outlet, useLocation } from "react-router-dom";
import BottomNavigation from "../components/common/navigation/BottomNavigation";
import Toast from "../components/Toast/Toast";
import { useToast } from "../contexts/ToastContext";
import styled from "styled-components";

function TabLayout() {
  const { pathname } = useLocation();
  const { toast } = useToast();

  return (
    <TabContainer>
      <MainContent>
        <Outlet key={pathname} />
        {toast && <Toast message={toast.message} placement="tab-bottom" />}
      </MainContent>
      <BottomNavigation />
    </TabContainer>
  );
}

export default TabLayout;

const TabContainer = styled.div`
  flex: 1;
  min-height: 0;
  background-color: ${({ theme }) => theme.colors.bg0};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MainContent = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;
