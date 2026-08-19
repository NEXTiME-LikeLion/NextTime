import styled from "styled-components";

export const Page = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
  overflow: hidden;
`;

export const ProgressBarTrack = styled.div`
  flex-shrink: 0;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colors.bg0};
  overflow: hidden;
  margin-top: 28px;
  margin-bottom: 44px;
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  border-radius: 2px;
  background-color: #00d579;
  width: ${({ $progress }) => $progress}%;
  transition: width 0.25s ease;
`;

export const Wrapper = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  padding: 0px 20px 40px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.white};
  overflow-y: auto;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 36px;
`;

export const QuestionBlock = styled.div`
  margin-bottom: 28px;
`;

export const QuestionLabel = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.bg1};
  margin-bottom: 8px;
`;

export const QuestionNote = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.bg1};
  margin-bottom: 18px;
`;

export const ChipGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 7px;
  width: 100%;
`;

export const ChipGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  button {
    width: 87px;
    height: 52px;
    padding: 8px;
    justify-content: center;
    font-size: 13px;
    text-align: center;
  }
`;

export const TextArea = styled.textarea`
  display: block;
  width: 100%;
  height: ${({ $height = 100 }) => $height}px;
  padding: 14px;
  border-radius: 12px;
  border-width: ${({ $focused, $filled }) =>
    $focused || $filled ? "1px" : "0.4px"};
  border-style: solid;
  border-color: ${({ theme, $focused, $filled }) =>
    $focused || $filled ? theme.colors.primary : theme.colors.light_gray};
  background-color: ${({ $focused, $filled }) =>
    $focused || $filled ? "rgba(0, 213, 121, 0.10)" : "#ffffff"};
  font-size: 14px;
  font-weight: ${({ $filled }) => ($filled ? 600 : 400)};
  font-family: inherit;
  color: #252843;
  line-height: 1.5;
  resize: none;
  box-sizing: border-box;
  outline: none;
  transition: all 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.light_gray};
  }
`;

export const NextButton = styled.button`
  display: block;
  width: 100%;
  max-width: 100%;
  height: 56px;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme, disabled }) =>
    disabled ? "rgba(178, 178, 178, 0.24)" : theme.colors.primary};
  color: ${({ disabled }) => (disabled ? "#252843" : "#ffffff")};
  transition: background-color 0.15s ease;
`;