import styled from "styled-components";

export const Chip = styled.button`
  width: 100%;
  max-width: 363px;
  height: 52px;
  padding: 16px;
  border-radius: 12px;
  border-width:${({ $selected }) => ($selected ? "1px" : "0.4px")}; 
    ${({ theme, $selected }) =>
        $selected ? theme.colors.primary : theme.colors.light_gray};
  border-style: solid;
  border-color: ${({ theme, $selected }) =>
        $selected ? theme.colors.primary : theme.colors.light_gray};
  background-color: ${({ theme, $selected }) =>
        $selected ? "rgba(0, 213, 121, 0.10)" : theme.colors.white};
  color: ${({ theme, $selected }) =>
        $selected ? "#252843" : "#68686D"};
  font-size: 14px;
  font-weight:  ${({ $selected }) => ($selected ? 600 : 500)};
  text-align: left;
  cursor: pointer;
`;