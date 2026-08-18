import styled from "styled-components";
import circleOvercome from "../../assets/circle-overcome.svg";
import circlePostpone from "../../assets/circle-postpone.svg";
import circleSmoke from "../../assets/circle-smoke.svg";

const DOT_STATUS = {
  overcome: circleOvercome,
  postpone: circlePostpone,
  smoke: circleSmoke,
};

function ProgressIndicator({ dots }) {
  return (
    <Row>
      {dots.map((status, index) => (
        <DotIcon
          key={`${status}-${index}`}
          src={DOT_STATUS[status]}
          alt={status}
        />
      ))}
    </Row>
  );
}

export default ProgressIndicator;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  width: 100%;
`;

const DotIcon = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  display: block;
  flex-shrink: 0;
`;
