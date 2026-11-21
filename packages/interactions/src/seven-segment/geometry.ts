/**
 * 7세그먼트 좌표 (digit 셀 W×H 기준).
 * 세그먼트 순서: a(상) b(우상) c(우하) d(하) e(좌하) f(좌상) g(중)
 */
export const DIGIT_W = 56;
export const DIGIT_H = 100;
export const COLON_W = 18;
const T = 10; // 세그먼트 두께
const GAP = 2; // 세그먼트 사이 틈

/** 양 끝이 뾰족한 육각형 세그먼트 */
function horizontal(cy: number, x0: number, x1: number) {
  const h = T / 2;
  return `${x0},${cy} ${x0 + h},${cy - h} ${x1 - h},${cy - h} ${x1},${cy} ${x1 - h},${cy + h} ${x0 + h},${cy + h}`;
}

function vertical(cx: number, y0: number, y1: number) {
  const h = T / 2;
  return `${cx},${y0} ${cx + h},${y0 + h} ${cx + h},${y1 - h} ${cx},${y1} ${cx - h},${y1 - h} ${cx - h},${y0 + h}`;
}

const L = T / 2;
const R = DIGIT_W - T / 2;
const TOP = T / 2;
const MID = DIGIT_H / 2;
const BOT = DIGIT_H - T / 2;

export const SEGMENTS = [
  horizontal(TOP, L + GAP, R - GAP), // a
  vertical(R, TOP + GAP, MID - GAP), // b
  vertical(R, MID + GAP, BOT - GAP), // c
  horizontal(BOT, L + GAP, R - GAP), // d
  vertical(L, MID + GAP, BOT - GAP), // e
  vertical(L, TOP + GAP, MID - GAP), // f
  horizontal(MID, L + GAP, R - GAP), // g
];

/** 글자별 켜지는 세그먼트 (a~g) */
export const GLYPHS: Record<string, readonly number[]> = {
  "0": [1, 1, 1, 1, 1, 1, 0],
  "1": [0, 1, 1, 0, 0, 0, 0],
  "2": [1, 1, 0, 1, 1, 0, 1],
  "3": [1, 1, 1, 1, 0, 0, 1],
  "4": [0, 1, 1, 0, 0, 1, 1],
  "5": [1, 0, 1, 1, 0, 1, 1],
  "6": [1, 0, 1, 1, 1, 1, 1],
  "7": [1, 1, 1, 0, 0, 0, 0],
  "8": [1, 1, 1, 1, 1, 1, 1],
  "9": [1, 1, 1, 1, 0, 1, 1],
  "-": [0, 0, 0, 0, 0, 0, 1],
  " ": [0, 0, 0, 0, 0, 0, 0],
};
