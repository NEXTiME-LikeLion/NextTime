import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { brand } from '../../constants/theme';


export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Title = styled.h2`
  align-self: stretch;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
  margin-bottom: 36px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 36px;
`;

export const Input = styled.input`
  width: 100%;
  height: 56px;
  padding: 16px 20px;
  border-radius: 20px;
  border: 1px solid ${brand.auth.textMuted};
  background-color: ${({ theme }) => theme.colors.bg.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 15px;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
   color: ${brand.auth.textMuted};
   font-weight: 700;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 56px;
  border-radius: 16px;
  border: none;
  background-color: ${brand.auth.primary};
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
`;

export const BottomText = styled.p`
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: ${brand.auth.textMuted};
`;

export const StyledLink = styled(Link)`
  color: ${brand.auth.primary};
  font-weight: 600;
  text-decoration: none;
  margin-left: 6px;
`;