import { Link } from "react-router-dom";
import statusBarImg from "../assets/statusbar.svg";
import * as S from "./SettingsPage.styles";

const SettingsPage = () => {
  return (
    <S.Container>
      <S.StatusBarImage src={statusBarImg} alt="" />
      <S.PageTitle>설정</S.PageTitle>

      <S.Section>
        <S.SectionTitle>개인화</S.SectionTitle>

        <S.ItemList>
          <S.Item as={Link} to="/settings/goal">
            <S.ItemLabel>나의 목표</S.ItemLabel>
            <S.Chevron viewBox="0 0 24 24">
              <path d="M9 6l6 6-6 6" />
            </S.Chevron>
          </S.Item>

          <S.Divider />

          <S.Item as={Link} to="/settings/exclude">
            <S.ItemLabel>추천 제외 관리</S.ItemLabel>
            <S.Chevron viewBox="0 0 24 24">
              <path d="M9 6l6 6-6 6" />
            </S.Chevron>
          </S.Item>
        </S.ItemList>
      </S.Section>

      <S.Section>
        <S.SectionTitle>기기 연결</S.SectionTitle>

        <S.ItemList>
          <S.Item as={Link} to="/settings/device">
            <S.ItemLabel>NEXTiME 기기</S.ItemLabel>
            <S.ItemRight>
              <S.StatusText>연결 안 됨</S.StatusText>
              <S.Chevron viewBox="0 0 24 24">
                <path d="M9 6l6 6-6 6" />
              </S.Chevron>
            </S.ItemRight>
          </S.Item>
        </S.ItemList>
      </S.Section>
    </S.Container>
  );
};

export default SettingsPage;
