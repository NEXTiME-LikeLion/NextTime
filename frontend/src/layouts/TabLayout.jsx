import { Outlet } from "react-router-dom";
import BottomNavigation from "../components/common/navigation/BottomNavigation";
import styled from "styled-components";

function TabLayout() {
  return (
    <TabContainer>
      <MainContent>
        <Outlet /> {/* 홈, 패턴, 설정 페이지 */}
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
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;
