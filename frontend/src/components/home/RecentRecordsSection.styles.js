import styled from "styled-components";

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding-top: 1.25rem;
  padding-bottom: 1.75rem;
  border-top: 1px solid rgba(178, 178, 178, 0.4);
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 0.75rem;
`;

export const SectionTitle = styled.h3`
  color: #000;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
`;

export const ViewAllButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.light_gray};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  line-height: 1.4;
`;
