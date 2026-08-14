import { useNavigate } from "react-router-dom";
import * as S from "./BackHeader.styles";
import statusBarImg from "../../assets/statusbar.svg";

const BackHeader = ({ title }) => {
  const navigate = useNavigate();

  return (
    <>
      <S.StatusBarImage src={statusBarImg} alt="" />
      <S.HeaderWrapper>
        <S.BackButton onClick={() => navigate(-1)} aria-label="뒤로가기">
          <S.ArrowIcon viewBox="0 0 24 24">
            <path d="M15 6l-6 6 6 6" />
          </S.ArrowIcon>
        </S.BackButton>
        <S.Title>{title}</S.Title>
      </S.HeaderWrapper>
    </>
  );
};

export default BackHeader;
