/**
 * 점들을 지나는 부드러운 곡선 (Catmull-Rom → 3차 베지어).
 * d3 없이 path 문자열만 만든다.
 */
export function smoothPath(points: readonly (readonly [number, number])[], tension = 0.5) {
  if (points.length < 2) return "";
  const [first] = points;
  let d = `M${first![0]},${first![1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? p2;
    const k = tension / 3;
    const c1x = p1[0] + (p2[0] - p0[0]) * k;
    const c1y = p1[1] + (p2[1] - p0[1]) * k;
    const c2x = p2[0] - (p3[0] - p1[0]) * k;
    const c2y = p2[1] - (p3[1] - p1[1]) * k;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}
