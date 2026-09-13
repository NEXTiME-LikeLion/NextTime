import styled from "styled-components";

export const Overlay = styled.div`
  position: absolute;
  inset: -1.5rem 0 0;
  background: rgba(178, 178, 178, 0.2);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  pointer-events: none;
  z-index: 1;
`;
