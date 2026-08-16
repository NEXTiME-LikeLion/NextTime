import styled from "styled-components";
import backArrow from "../../assets/back-arrow.svg";

function Header({ title, subtitle, onBack }) {
  return (
    <Wrapper>
      <NavRow>
        <BackButton type="button" onClick={onBack} aria-label="뒤로가기">
          <ArrowIcon src={backArrow} alt="뒤로가기 아이콘" />
        </BackButton>
        <TitleBlock>
          {title && <Title>{title}</Title>}
          {subtitle && <Title>{subtitle}</Title>}
        </TitleBlock>
      </NavRow>
    </Wrapper>
  );
}

export default Header;

const Wrapper = styled.div`
  width: 100%;
  flex-shrink: 0;
  position: relative;
`;

const NavRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding-bottom: 1.25rem;
`;

const BackButton = styled.button`
  grid-column: 1;
  justify-self: start;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
`;

const TitleBlock = styled.div`
  grid-column: 2;
  display: flex;
  flex-direction: column;
  align-items: center; /* 타이틀만 있을 때도 가운데 정렬 */
  gap: 0.25rem;
  min-width: 0;
`;

const ArrowIcon = styled.img`
  width: 0.73594rem;
  height: 1.25rem;
  flex-shrink: 0;
`;

const Title = styled.p`
  color: ${({ theme }) => theme.colors.bg0};
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.4;
`;
