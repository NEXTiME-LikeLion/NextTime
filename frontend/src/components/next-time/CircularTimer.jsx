import styled from "styled-components";

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function CircularTimer({
  totalSeconds = 0,
  remainingSeconds = 0,
  showRemainingLabel = false,
}) {
  const size = 200;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeTotal = Math.max(totalSeconds, 1);
  const progress = Math.min(1, Math.max(0, remainingSeconds / safeTotal));
  const dashOffset = circumference * (1 - progress);

  return (
    <Wrapper>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <CircleTrack
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <CircleProgress
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </Svg>
      <CenterContent>
        <TimeText>{formatTime(remainingSeconds)}</TimeText>
        {showRemainingLabel && <RemainingLabel>남은 시간</RemainingLabel>}
      </CenterContent>
    </Wrapper>
  );
}

export default CircularTimer;

const Wrapper = styled.div`
  position: relative;
  width: 12.5rem;
  height: 12.5rem;
`;

const Svg = styled.svg`
  display: block;
  transform: rotate(-90deg);
`;

const CircleTrack = styled.circle`
  fill: none;
  stroke: #1d1d20;
`;

const CircleProgress = styled.circle`
  fill: none;
  stroke: ${({ theme }) => theme.colors.primary};
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
`;

const CenterContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TimeText = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: 2.34375rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.078rem;
`;

const RemainingLabel = styled.p`
  color: ${({ theme }) => theme.colors.light_gray};
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.4;
`;
