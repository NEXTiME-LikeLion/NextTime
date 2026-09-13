import PatternHero from "../components/pattern/PatternHero";
import PatternContent from "../components/pattern/PatternContent";
import PatternPreparingOverlay from "../components/pattern/PatternPreparingOverlay";
import heroBackground from "../assets/pattern/hero-background.png";
import * as S from "./PatternPage.styles";

function PatternPage() {
  const isPreparing = false;

  return (
    <S.Screen>
      <S.HeroBackground>
        <S.HeroImage src={heroBackground} alt="" />
        <S.HeroFade $preparing={isPreparing} />
      </S.HeroBackground>
      <S.SafeTop />
      <S.ScrollBody>
        <PatternHero isPreparing={isPreparing} />
        <S.CardsWrap>
          {isPreparing ? <PatternPreparingOverlay /> : null}
          <S.CardsArea>
            <PatternContent />
          </S.CardsArea>
        </S.CardsWrap>
      </S.ScrollBody>
    </S.Screen>
  );
}

export default PatternPage;
