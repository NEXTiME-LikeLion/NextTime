import styled from "styled-components";

function TextAreaField({
  value,
  onChange,
  placeholder,
  rows = 4,
  ...rest
}) {
  return (
    <TextArea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      {...rest}
    />
  );
}

export default TextAreaField;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 7rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  background: rgba(247, 247, 250, 0.1);
  color: ${({ theme }) => theme.colors.bg0};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  word-break: keep-all;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
