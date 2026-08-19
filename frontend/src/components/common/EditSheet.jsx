import { useState } from "react";
import * as S from "./EditSheet.styles";

const EditSheet = ({
  type,
  title,
  description,
  options,
  placeholder,
  initialValue,
  onClose,
  onSubmit,
}) => {
  const [selected, setSelected] = useState(initialValue);
  const [text, setText] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const isRadio = type === "radio";
  const currentValue = isRadio ? selected : text;
  const isActive = isRadio ? !!selected : isFocused;

  const handleSubmit = () => {
    if (!isActive) return;
    onSubmit(currentValue);
    onClose();
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.Sheet onClick={(e) => e.stopPropagation()}>
        <S.Handle />

        <S.Title>{title}</S.Title>
        {description && <S.Description>{description}</S.Description>}

        {isRadio ? (
          <S.OptionList>
            {options.map((option, index) => (
              <div key={option.value}>
                <S.OptionRow onClick={() => setSelected(option.value)}>
                  <S.RadioCircle $checked={selected === option.value} />
                  <S.OptionLabel>{option.label}</S.OptionLabel>
                </S.OptionRow>
                {index < options.length - 1 && <S.OptionDivider />}
              </div>
            ))}
          </S.OptionList>
        ) : (
          <S.TextArea
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            $active={isFocused}
          />
        )}

        <S.SubmitButton
          disabled={!isActive}
          $active={isActive}
          onClick={handleSubmit}
        >
          변경하기
        </S.SubmitButton>

        {!isRadio && (
          <S.FooterHint>
            변경한 내용은 앞으로 생성되는 NEXT ME 메시지에 반영돼요.
          </S.FooterHint>
        )}
      </S.Sheet>
    </S.Overlay>
  );
};

export default EditSheet;
