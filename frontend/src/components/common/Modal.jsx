import styled from "styled-components";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Content onClick={(e) => e.stopPropagation()}>{children}</Content>
    </Overlay>
  );
}

export default Modal;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Content = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 1.5rem;
  box-shadow: 0 4px 8px 4px rgba(0, 0, 0, 0.12);
  margin-inline: 0.94rem;
  padding: 1.75rem 1.25rem;
  max-width: 23.25rem;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
