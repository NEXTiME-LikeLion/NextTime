import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
  overflow-y: auto;
`;

export const Content = styled.div`
  padding: 0 20px 40px;
`;

export const SectionLabel = styled.p`
  font-size: 14px;
  color: #b2b2b2;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 12px;
`;

export const FirstSectionLabel = styled(SectionLabel)`
  margin-top: 39px;  
  font-weight: 600;
  color: #b2b2b2;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const RowText = styled.span`
  font-size: 18px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.bg_black};
`;

export const BodyText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.bg_black};
`;

export const EditButton = styled.button`
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

export const EditButtonRight = styled(EditButton)`
  display: block;
  margin-left: auto;
  margin-top: 12px;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #191B241A;
  margin-top: 24px;
`;

/* NEXT ME 카드 */

export const NextMeCard = styled.div`
  position: relative;
  width: 357px;
  min-height: 244px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0px 4px 8px 4px rgba(0, 0, 0, 0.12);
`;

export const NextMeLabel = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-top: 16px;
  margin-bottom: 8px;
`;

export const NextMeText = styled.p`
  font-size: 24px;
  font-weight: 600;
  line-height: 1.4;
  color: #ffffff;
  margin-bottom: 16px;
  max-width: 60%;
  word-break: break-all;
`;

export const NextMeSubLabel = styled.p`
  font-size: 14px;
  color: #FEFEFE;
  margin-bottom: 4px;
  font-weight: 600;
`;

export const NextMeSubText = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: #FEFEFE;
  max-width: 55%;
  font-weight: 400;
`;

export const MascotImage = styled.img`
  position: absolute;
  right: 12px;
  bottom: 49px;
  width: 137px;
  height: 154px;
`;