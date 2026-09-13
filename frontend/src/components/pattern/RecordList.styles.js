import styled from "styled-components";


function getCravingColor(text, theme) {
    if (text.includes("강함")) return "#FE8159";
    if (text.includes("보통")) return theme.colors.primary;
    return "inherit";
}


export const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const RecordItem = styled.button`
  border: none;
  background: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(178, 178, 178, 0.2);
  cursor: pointer;
`;

export const RecordTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.bg1};
  line-height: 1.4;
`;

export const RecordMeta = styled.p`
  color: #b2b2b2;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
`;

export const CravingText = styled.span`
  color: ${({ $label, theme }) => getCravingColor($label, theme)};
`;
