import styled from "styled-components";
import OptionCard from "./OptionCard";
import OptionChip from "./OptionChip";

function OptionGrid({
  options = [],
  variant = "chip",
  layout = "list",
  selectedValue,
  onChange,
}) {
  const handleSelect = (value) => {
    onChange?.(value);
  };

  if (variant === "card") {
    return (
      <CardGrid>
        {options.map((option) => (
          <CardCell key={option.value}>
            <OptionCard
              label={option.label}
              mood={option.mood}
              selected={selectedValue === option.value}
              onClick={() => handleSelect(option.value)}
            />
          </CardCell>
        ))}
      </CardGrid>
    );
  }

  if (layout === "grid-3") {
    return (
      <ChipGrid3>
        {options.map((option) => (
          <OptionChip
            key={option.value}
            label={option.label}
            selected={selectedValue === option.value}
            onClick={() => handleSelect(option.value)}
          />
        ))}
      </ChipGrid3>
    );
  }

  if (layout === "grid-2") {
    return (
      <ChipGrid2>
        {options.map((option) => (
          <OptionChip
            key={option.value}
            label={option.label}
            selected={selectedValue === option.value}
            onClick={() => handleSelect(option.value)}
            fullWidth
          />
        ))}
      </ChipGrid2>
    );
  }

  return (
    <ChipList>
      {options.map((option) => (
        <OptionChip
          key={option.value}
          label={option.label}
          selected={selectedValue === option.value}
          onClick={() => handleSelect(option.value)}
          fullWidth
        />
      ))}
    </ChipList>
  );
}

export default OptionGrid;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const CardCell = styled.div`
  min-width: 0;

  & > button {
    width: 100%;
    aspect-ratio: 1 / 1;
  }
`;

const ChipGrid3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
`;

const ChipGrid2 = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const ChipList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;
