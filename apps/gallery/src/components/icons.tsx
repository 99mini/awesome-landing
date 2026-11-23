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

export function Sun({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden>
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
    </svg>
  );
}

export function Moon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z" />
    </svg>
  );
}

export function Monitor({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden>
      <rect x="2" y="2.5" width="12" height="8.5" rx="1.5" />
      <path d="M5.5 14h5M8 11v3" />
    </svg>
  );
}
