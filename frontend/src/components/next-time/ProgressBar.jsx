import styled from "styled-components";

function ProgressBar({ percentage = 0 }) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <Track>
      <Fill $percentage={clamped} />
    </Track>
  );
}

export default ProgressBar;

const Track = styled.div`
  width: 100%;
  height: 0.25rem;
  border-radius: 6.25rem;
  background: rgba(178, 178, 178, 0.4);
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  border-radius: 6.25rem;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 0.2s ease;
`;
