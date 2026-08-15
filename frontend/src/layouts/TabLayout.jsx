import { Outlet } from "react-router-dom";
import BottomNavigation from "../components/common/navigation/BottomNavigation";
import Toast from "../components/Toast/Toast";
import { useToast } from "../contexts/ToastContext";
import styled from "styled-components";

function TabLayout() {
  const { toast } = useToast();

  return (
    <TabContainer>
      <MainContent>
        <Outlet /> {/* 홈, 패턴, 설정 페이지 */}
        {toast && <Toast message={toast.message} placement="tab-bottom" />}
      </MainContent>
      <BottomNavigation />
    </TabContainer>
  );
}

export default TabLayout;

const TabContainer = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.bg0};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const MainContent = styled.div`
  position: relative;
  flex: 1;
  overflow-y: auto;
`;
