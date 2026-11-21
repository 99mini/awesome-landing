import { startTransition, useEffect, useState, type RefObject } from "react";

/**
 * 요소가 화면(± margin) 안에 있는지.
 * 관찰 결과가 오기 전에는 `null` — 첫 렌더에서 보이는 것들까지 꺼졌다 켜지지 않도록 '모름'을 구분한다.
 */
export function useVisibility(ref: RefObject<Element | null>, margin = "400px 0px") {
  const [visible, setVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let observer: IntersectionObserver | undefined;
    let cancelled = false;
    // 웹폰트가 늦게 오면 줄바꿈과 높이가 바뀐다 — 글꼴이 준비된 뒤에 관찰을 시작해야 내려둔 카드의 높이가 맞는다
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          // transition 으로 바꿔야, 처음 보이는 데모의 코드를 받는 동안 React 가 지금 화면(자리표시)을
          // 그대로 두고 masonry 바깥 Suspense 로 빠지지 않는다
          if (entry) startTransition(() => setVisible(entry.isIntersecting));
        },
        { rootMargin: margin },
      );
      observer.observe(el);
    });
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [ref, margin]);

  return visible;
}

/** 요소의 마지막 높이 — `paused` 동안에는 갱신하지 않아 내리기 직전 값이 남는다 */
export function useLastHeight(ref: RefObject<HTMLElement | null>, paused: boolean) {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || paused) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setHeight(entry.borderBoxSize[0]?.blockSize ?? el.offsetHeight);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, paused]);

  return height;
}
