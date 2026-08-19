import styled from "styled-components";
import mascotNeutral from "../../assets/mascot-neutral.png";
import mascotCraving from "../../assets/mascot-craving.png";
import mascotUrgent from "../../assets/mascot-urgent.png";
import mascotRun from "../../assets/mascot-run.png";
import mascotSuccess from "../../assets/mascot-success.png";

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
  llg: { width: "10rem", height: "13.75rem" },
};

function MascotCharacter({
  mood = "neutral",
  size = "md",
  alt = "",
  priority = false,
}) {
  const src = MOOD_ASSETS[mood];

  if (!src) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
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
