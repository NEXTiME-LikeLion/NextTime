import * as S from "./ChipButton.styles";

const ChipButton = ({ label, selected, onClick }) => {
  return (
    <S.Chip type="button" $selected={selected} onClick={onClick}>
      {label}
    </S.Chip>
  );
};

export default ChipButton;
