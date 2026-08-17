import styled from "styled-components";
import { Link } from "react-router-dom";

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Title = styled.h2`
  align-self: stretch;
  color: "#191B24"; // FIX
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
  margin-bottom: 72px;
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 18px;
  font-weight: 700;
  color: '#686D79'; // FIX
`;

export const Input = styled.input`
  width: 100%;
  height: 56px;
  padding: 16px 20px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.brand.auth.textMuted};
  background-color: ${({ theme }) => theme.colors.white};
  color: "#191B24"; // FIX
  font-size: 15px;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: ${({ theme }) => theme.brand.auth.textMuted};
    font-weight: 700;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 56px;
  border-radius: 16px;
  border: none;
  background-color: ${({ theme }) => theme.brand.auth.primary};
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
`;

export const BottomText = styled.p`
  margin-top: 12px;
  margin-bottom: 12px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.brand.auth.textMuted};
  font-weight: 500;
`;

export const VerifySpacer = styled.div`
  height: 200px; 
`;

export const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.brand.auth.primary};
  text-decoration: none;
  margin-left: 6px;
`;

export const ErrorText = styled.p`
  font-size: 13px;
  color: #ff5a5a;
  margin-top: -20px;
  margin-bottom: 20px;
`;

export const HelperText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray};
  margin-top: 6px;
`;