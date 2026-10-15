/** Line-art sun from the AREVÉ logo: tapered rays over a double arc. Inherits `currentColor`. */
export default function SunMark({
  className,
  strokeWidth = 1.4,
  title,
}: {
  className?: string;
  strokeWidth?: number;
  title?: string;
}) {
  const cx = 60;
  const cy = 60;
  const rays = Array.from({ length: 11 }, (_, i) => {
    const angle = Math.PI - (i * Math.PI) / 10;
    const long = i % 2 === 0;
    const r1 = 38;
    const r2 = long ? 58 : 51;
    return {
      x1: cx + r1 * Math.cos(angle),
      y1: cy - r1 * Math.sin(angle),
      x2: cx + r2 * Math.cos(angle),
      y2: cy - r2 * Math.sin(angle),
    };
  });

  return (
    <svg
      viewBox="0 0 120 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
        {rays.map((r, i) => (
          <line key={i} x1={r.x1.toFixed(2)} y1={r.y1.toFixed(2)} x2={r.x2.toFixed(2)} y2={r.y2.toFixed(2)} />
        ))}
        <path d={`M ${cx - 32} ${cy} A 32 32 0 0 1 ${cx + 32} ${cy}`} />
        <path d={`M ${cx - 26} ${cy} A 26 26 0 0 1 ${cx + 26} ${cy}`} />
      </g>
    </svg>
  );
}
