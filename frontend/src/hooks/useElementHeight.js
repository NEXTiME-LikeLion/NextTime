import { useRef, useState, useLayoutEffect } from "react";

export function useElementHeight() {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );

    const observer = new ResizeObserver((entries) => {
      const heightPx = el.offsetHeight;
      setHeight(heightPx / rootFontSize); // rem 단위로 변환
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return [ref, height]; // rem 값 (숫자만, 단위 없음)
}
