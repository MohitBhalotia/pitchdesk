"use client";

const ITEMS = [
  "◇ IIT Pitch Cup",
  "△ Altus Ventures",
  "○ Y Forum '26",
  "◎ MIT Delta v",
  "□ Kindred Labs",
  "✦ Northbeam",
  "◆ Orbital.dev",
  "✕ Aventis",
];

export default function LogoMarquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {ITEMS.concat(ITEMS).map((label, i) => (
          <span className="marquee-item" key={i}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
