/** 갤러리 UI 아이콘 — currentColor 로 그려서 색은 className 이 정한다 */

interface IconProps {
  className?: string;
}

const base = {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function Check({ className }: IconProps) {
  return (
    <svg {...base} aria-hidden className={className}>
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  );
}

export function Chevron({ className }: IconProps) {
  return (
    <svg {...base} aria-hidden className={className}>
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

export function Search({ className }: IconProps) {
  return (
    <svg {...base} aria-hidden className={className}>
      <circle cx="7" cy="7" r="4.25" />
      <path d="m10.25 10.25 3.25 3.25" />
    </svg>
  );
}
