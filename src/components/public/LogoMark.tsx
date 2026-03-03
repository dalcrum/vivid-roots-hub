export default function LogoMark({
  size = 32,
  color = "#FAF6F0",
}: {
  size?: number;
  color?: string;
}) {
  const inner = color === "#FAF6F0" ? "#2C5F6E" : "#0a0a0a";
  return (
    <svg width={size} height={size} viewBox="0 0 100 120" fill="none">
      <path
        d="M50 5 C50 5 12 50 12 72 C12 93 29 108 50 108 C71 108 88 93 88 72 C88 50 50 5 50 5Z"
        fill={color}
      />
      <path
        d="M50 30 C44 45 32 55 32 55 C32 55 40 52 45 54 C40 60 30 68 30 68 C30 68 40 65 46 66 L46 82 C46 82 38 85 34 90 C34 90 42 88 50 88 C58 88 66 90 66 90 C62 85 54 82 54 82 L54 66 C60 65 70 68 70 68 C70 68 60 60 55 54 C60 52 68 55 68 55 C68 55 56 45 50 30Z"
        fill={inner}
      />
      <path
        d="M46 82 C42 86 34 92 28 95 M50 85 C50 90 50 96 50 100 M54 82 C58 86 66 92 72 95 M44 84 C40 90 38 96 36 100 M56 84 C60 90 62 96 64 100"
        stroke={inner}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
