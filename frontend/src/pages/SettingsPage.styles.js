import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 20px 0;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 800;
  color: #252843;
  margin-bottom: 32px;
`;

export const Section = styled.section`
  margin-bottom: 32px;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 20px;
`;

export const ItemList = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 4px 16px 20px;
  text-decoration: none;
  cursor: pointer;
`;

export const ItemLabel = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.bg_black};
`;

export const ItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StatusText = styled.span`
  font-size: 18px;
  font-weight: 400;
  color: #B2B2B2;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #191B241A;
  margin: 4px 0;
`;

export const Chevron = styled.svg`
  width: 20px;
  height: 20px;
  fill: none;
  stroke: #B2B2B2;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`;