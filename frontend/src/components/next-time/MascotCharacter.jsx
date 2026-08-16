import styled from "styled-components";
import mascotNeutral from "../../assets/mascot-neutral.svg";
import mascotCraving from "../../assets/mascot-craving.svg";
import mascotUrgent from "../../assets/mascot-urgent.svg";
import mascotRun from "../../assets/mascot-run.svg";
import mascotSuccess from "../../assets/mascot-success.svg";

const MOOD_ASSETS = {
  neutral: mascotNeutral,
  craving: mascotCraving,
  urgent: mascotUrgent,
  run: mascotRun,
  success: mascotSuccess,
};

const SIZE_MAP = {
  sm: { width: "6.5rem", height: "7.5rem" },
  md: { width: "8.125rem", height: "9.375rem" },
  lg: { width: "10rem", height: "11.375rem" },
};

function MascotCharacter({ mood = "neutral", size = "md", alt = "" }) {
  const src = MOOD_ASSETS[mood];

  if (!src) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      $width={SIZE_MAP[size].width}
      $height={SIZE_MAP[size].height}
    />
  );
}

export default MascotCharacter;

const Image = styled.img`
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  object-fit: contain;
  flex-shrink: 0;
`;
