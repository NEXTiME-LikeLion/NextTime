import styled from "styled-components";

function BottomSheet({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Content onClick={(e) => e.stopPropagation()}>
        <Handle />
        {children}
      </Content>
    </Overlay>
  );
}

export default BottomSheet;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
`;

const Content = styled.div`
  position: relative;
  width: 100%;
  max-height: 80%;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.bg0};
  border-radius: 1.25rem 1.25rem 0 0;
  padding: 3rem 1.25rem;

  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Handle = styled.div`
  width: 4.5rem;
  height: 0.25rem;
  border-radius: 6.25rem;
  background: rgba(217, 217, 217, 0.6);
  position: absolute;
  left: 10.3125rem;
  top: 1.0625rem;
`;
