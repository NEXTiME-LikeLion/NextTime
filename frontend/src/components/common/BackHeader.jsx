import { useNavigate } from "react-router-dom";
import * as S from "./BackHeader.styles";
import statusBarImg from "../../assets/statusbar.svg";

const BackHeader = ({ title, rightContent, onBack }) => {
  const navigate = useNavigate();
  const handleClick = onBack || (() => navigate(-1));

  return (
    <>
      <S.StatusBarImage src={statusBarImg} alt="" />
      <S.HeaderWrapper>
        <S.BackButton onClick={handleClick} aria-label="뒤로가기">
          <S.ArrowIcon viewBox="0 0 24 24">
            <path d="M15 6l-6 6 6 6" />
          </S.ArrowIcon>
        </S.BackButton>
        {title && <S.Title>{title}</S.Title>}
        {rightContent && <S.RightContent>{rightContent}</S.RightContent>}
      </S.HeaderWrapper>
    </>
  );
};

export default BackHeader;
