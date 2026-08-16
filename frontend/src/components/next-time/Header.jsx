import styled from "styled-components";
import statusBarImg from "../../assets/statusbar.svg";

function Header({ title, subtitle, onBack }) {
  return (
    <Wrapper>
      <StatusBarImage src={statusBarImg} alt="" />
      <NavRow>
        <BackButton type="button" onClick={onBack} aria-label="뒤로가기">
          <ArrowIcon viewBox="0 0 24 24">
            <path d="M15 6l-6 6 6 6" />
          </ArrowIcon>
        </BackButton>
        <TitleBlock>
          {title && <Title>{title}</Title>}
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </TitleBlock>
      </NavRow>
    </Wrapper>
  );
}

export default Header;

const Wrapper = styled.div`
  flex-shrink: 0;
`;

const StatusBarImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const NavRow = styled.header`
  display: flex;
  align-items: flex-start;
  gap: 8.125rem;
  padding: 0 1.25rem 1.25rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.734rem;
  height: 1.25rem;
  margin-top: 0;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
`;

const ArrowIcon = styled.svg`
  width: 0.734rem;
  height: 1.25rem;
  fill: none;
  stroke: ${({ theme }) => theme.colors.bg0};
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

const Title = styled.p`
  color: ${({ theme }) => theme.colors.bg0};
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.4;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  word-break: keep-all;
`;
