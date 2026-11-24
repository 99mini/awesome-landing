/** 애니메이션하는 값 — transform · opacity · clip-path 만 */
export type Frame = {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  clipPath: string;
};

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** 사진 둘레의 여백(px) — photo-viewer.css.ts 의 틀 크기와 같은 값 */
export const PADDING = {
  narrowBelow: 640,
  narrow: { x: 12, y: 64 },
  wide: { x: 80, y: 56 },
} as const;

/** 비율을 지키며 영역 안에 꽉 차는 상자 (가운데) */
export function fit(area: Box, aspect: number): Box {
  const pad = area.width < PADDING.narrowBelow ? PADDING.narrow : PADDING.wide;
  const width = Math.min(area.width - pad.x * 2, (area.height - pad.y * 2) * aspect);
  const height = width / aspect;
  return {
    left: area.left + (area.width - width) / 2,
    top: area.top + (area.height - height) / 2,
    width,
    height,
  };
}

const inset = (y: number, x: number, round: number) =>
  `inset(${y}px ${x}px ${y}px ${x}px round ${round}px)`;

/** 다 커진 모양 */
export const openFrame = (radius: number): Frame => ({
  x: 0,
  y: 0,
  scale: 1,
  opacity: 1,
  clipPath: inset(0, 0, radius),
});

/**
 * frame 을 thumb 칸에 꼭 맞게 — 칸을 덮을 만큼(object-fit: cover) 줄이고 넘치는 부분은 자른다.
 * 칸이 없으면 제자리에서 살짝 작아지며 흐려진다.
 */
export function closedFrame(thumb: Box | null, frame: Box, radius: number): Frame {
  if (!thumb || thumb.width === 0 || thumb.height === 0) {
    return { x: 0, y: 0, scale: 0.96, opacity: 0, clipPath: inset(0, 0, radius) };
  }
  const scale = Math.max(thumb.width / frame.width, thumb.height / frame.height);
  return {
    x: thumb.left + thumb.width / 2 - (frame.left + frame.width / 2),
    y: thumb.top + thumb.height / 2 - (frame.top + frame.height / 2),
    scale,
    opacity: 1,
    clipPath: inset(
      (frame.height - thumb.height / scale) / 2,
      (frame.width - thumb.width / scale) / 2,
      radius / scale,
    ),
  };
}
