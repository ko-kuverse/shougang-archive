export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 22 9.5 11 14 18l3-5 6 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="miter"
      />
      <path
        d="M6 26v-4M11 26v-7M16 26v-5M21 26v-8M26 26v-6"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect x="23" y="23" width="4" height="4" fill="var(--accent)" />
    </svg>
  );
}
