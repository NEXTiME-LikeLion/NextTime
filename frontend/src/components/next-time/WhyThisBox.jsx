import styled from "styled-components";

function WhyThisBox({ text }) {
  return (
    <Box>
      <Title>💡 왜 이 행동일까요?</Title>
      <Body>{text}</Body>
    </Box>
  );
}

export default WhyThisBox;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 1.25rem;
  border-radius: 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  background: rgba(247, 247, 250, 0.1);
  word-break: keep-all;
`;

const Title = styled.p`
  color: ${({ theme }) => theme.colors.light_gray};
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
`;

const Body = styled.p`
  color: ${({ theme }) => theme.colors.bg0};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
`;
