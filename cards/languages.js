export function languagesCard(langs) {
  // Ensure sorted by size desc and take top 5
  const sorted = [...langs].sort((a, b) => (b.size ?? 0) - (a.size ?? 0));
  const top = sorted.slice(0, 5);

  const total = top.reduce((sum, l) => sum + (l.size ?? 0), 0) || 1;
  const max = Math.max(...top.map((l) => l.size ?? 0), 1);

  const width = 600;
  const rowH = 52;
  const innerLeft = 24;
  const innerRight = width - 24;
  const height = top.length * rowH + 120;
  const font = "Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif";

  const palette = [
    { a: "#22d3ee", b: "#3b82f6" },
    { a: "#8b5cf6", b: "#22d3ee" },
    { a: "#f59e0b", b: "#ef4444" },
    { a: "#10b981", b: "#22d3ee" },
    { a: "#ef4444", b: "#8b5cf6" },
  ];

  const barX = innerLeft + 140; // room for labels on the left
  const valueSpace = 80; // reserved space for numeric value at right
  const barTrackWidth = Math.max(200, innerRight - barX - valueSpace);

  const gradients = top
    .map(
      (_, i) => `
      <linearGradient id="lang-${i}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${palette[i % palette.length].a}"/>
        <stop offset="100%" stop-color="${palette[i % palette.length].b}"/>
      </linearGradient>`
    )
    .join("");

  const rows = top
    .map((l, i) => {
      const y = 80 + i * rowH;
      const percent = Math.round(((l.size ?? 0) / total) * 100);
      const barW = Math.max(6, Math.round(((l.size ?? 0) / max) * barTrackWidth));

      return `
      <!-- Row ${i + 1} -->
      <g transform="translate(0, ${y})">
        <!-- Label -->
        <text x="${innerLeft}" y="0" dy="6" fill="#e5e7eb" font-family="${font}" font-size="15" font-weight="600">${l.name}</text>
        <text x="${innerLeft}" y="24" fill="#9ca3af" font-family="${font}" font-size="12">${percent}%</text>

        <!-- Bar track -->
        <rect x="${barX}" y="-10" width="${barTrackWidth}" height="20" rx="10" fill="#111827" stroke="#1f2937" stroke-width="1"/>
        <!-- Bar fill -->
        <rect x="${barX}" y="-10" width="${barW}" height="20" rx="10" fill="url(#lang-${i})"/>
        <!-- Value (right aligned to avoid overflow) -->
        <text x="${innerRight - 12}" y="6" fill="#9ca3af" font-family="${font}" font-size="12" text-anchor="end">${l.size}</text>
      </g>`;
    })
    .join("");

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Top languages">
  <defs>
    <linearGradient id="bgLang" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#0b1324"/>
    </linearGradient>
    <linearGradient id="accentLang" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
    ${gradients}
  </defs>

  <rect width="100%" height="100%" fill="url(#bgLang)" rx="16"/>

  <!-- Header -->
  <g transform="translate(${innerLeft}, 26)">
    <circle cx="8" cy="-2" r="4" fill="url(#accentLang)"/>
    <text x="20" y="0" fill="#e5e7eb" font-family="${font}" font-size="20" font-weight="700">Top Languages</text>
    <rect x="0" y="18" width="140" height="3" fill="url(#accentLang)" rx="2"/>
  </g>

  <!-- Rows -->
  ${rows}

  <!-- Footer hint -->
  <g transform="translate(${innerRight - 0}, ${height - 16})">
    <text text-anchor="end" fill="#6b7280" font-family="${font}" font-size="11">Proportional to usage</text>
  </g>
</svg>`;
}
