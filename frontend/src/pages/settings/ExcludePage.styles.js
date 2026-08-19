import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const Content = styled.div`
  padding: 0 20px;
`;

export const SectionLabel = styled.p`
  font-size: 14px;
  color: #B2B2B2;
  margin-top: 37px;
  margin-bottom: 16px;
`;

export const ItemList = styled.div``;

export const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
`;

export const ItemLabel = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.bg_black};
`;

export const RestoreButton = styled.button`
  padding: 6px 14px;
  border-radius: 12px;
  border: 1px solid #00D57980;
  background: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #191B241A;
  margin: 0;
`;

/* ── 빈 상태 ── */

export const EmptyContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 80px;
`;

export const EmptyCenterBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const EmptyIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #F7F7FA;
  margin-bottom: 20px;
`;

export const EmptyImage = styled.img`
  width: 22px;
  height: 22px;
`;

export const EmptyTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.bg_black};
  margin-bottom: 8px;
`;

export const EmptyDescription = styled.p`
  font-size: 14px;
  line-height: 1.4;
  text-align: center;
  color: #191B2480;
`;

export const FooterDivider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid #191B241A;
  margin-top: 60px;
`;

export const FooterNote = styled.p`
  margin-top: 20px;
  font-size: 13px;
  line-height: 1.4;
  text-align: left;
  color: ${({ theme }) => theme.colors.light_gray};
`;