export function skillsCard(skills) {
  // Normalize input: allow string or { name, color }
  const items = (skills || []).map((s) =>
    typeof s === "string" ? { name: s } : { name: s?.name ?? "", color: s?.color }
  );

  const width = 600;
  const left = 24;
  const right = width - 24;
  const topPad = 26;
  const rowH = 40;
  const pillH = 28;
  const font =
    "Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif";

  // Known skill color pairs (a -> b gradient)
  const palette = {
    react: { a: "#61dafb", b: "#3b82f6" },
    "reactjs": { a: "#61dafb", b: "#3b82f6" },
    node: { a: "#10b981", b: "#22d3ee" },
    "node.js": { a: "#10b981", b: "#22d3ee" },
    typescript: { a: "#3178c6", b: "#3b82f6" },
    javascript: { a: "#f59e0b", b: "#ef4444" },
    python: { a: "#22d3ee", b: "#3b82f6" },
    go: { a: "#22d3ee", b: "#10b981" },
    rust: { a: "#ef4444", b: "#8b5cf6" },
    html: { a: "#f59e0b", b: "#ef4444" },
    css: { a: "#3b82f6", b: "#22d3ee" },
    vue: { a: "#10b981", b: "#22d3ee" },
    angular: { a: "#ef4444", b: "#8b5cf6" },
    svelte: { a: "#ef4444", b: "#f59e0b" },
    docker: { a: "#3b82f6", b: "#22d3ee" },
    graphql: { a: "#e10098", b: "#8b5cf6" },
    mongodb: { a: "#10b981", b: "#22d3ee" },
    postgresql: { a: "#3b82f6", b: "#22d3ee" },
    redis: { a: "#ef4444", b: "#f59e0b" },
    aws: { a: "#f59e0b", b: "#ef4444" },
    azure: { a: "#3b82f6", b: "#22d3ee" },
    gcp: { a: "#3b82f6", b: "#10b981" },
    tailwind: { a: "#22d3ee", b: "#3b82f6" },
  };

  const toKey = (name) => (name || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  const colorFor = (name) => palette[toKey(name)] ?? { a: "#8b5cf6", b: "#22d3ee" };

  // Layout: compute pill positions with row wrapping
  let x = left;
  let y = topPad + 54; // space for header
  const pillPadX = 14; // inner text padding
  const iconW = 18;
  const gap = 10;
  const pills = [];

  // crude text width approx: 7.2px per char at 13px font
  const txtW = (t) => Math.max(24, Math.round(t.length * 7.2));

  items.forEach((it, i) => {
    const w = iconW + pillPadX * 2 + txtW(it.name);
    if (x + w > right) {
      x = left;
      y += rowH;
    }
    const col = colorFor(it.name);
    pills.push({ i, name: it.name, x, y, w, col });
    x += w + gap;
  });

  const height = y + rowH + 30;

  const gradientDefs = pills
    .map(
      (p) => `\n    <linearGradient id="skill-${p.i}" x1="0" y1="0" x2="1" y2="0">\n      <stop offset="0%" stop-color="${p.col.a}"/>\n      <stop offset="100%" stop-color="${p.col.b}"/>\n    </linearGradient>`
    )
    .join("");

  const pillNodes = pills
    .map((p) => {
      return `\n    <g transform="translate(${p.x}, ${p.y})">\n      <rect x="0" y="0" width="${p.w}" height="${pillH}" rx="999" fill="#111827" stroke="#1f2937" stroke-width="1"/>\n      <circle cx="${pillPadX + iconW / 2}" cy="${pillH / 2}" r="6" fill="url(#skill-${p.i})"/>\n      <text x="${pillPadX + iconW + 4}" y="${pillH / 2}" fill="#e5e7eb" font-family="${font}" font-size="13" font-weight="600" dominant-baseline="middle">${p.name}</text>\n    </g>`;
    })
    .join("");

  return `\n<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Skills">\n  <defs>\n    <linearGradient id="bgSkills" x1="0" y1="0" x2="1" y2="1">\n      <stop offset="0%" stop-color="#0f172a"/>\n      <stop offset="100%" stop-color="#0b1324"/>\n    </linearGradient>\n    <linearGradient id="accentSkills" x1="0" y1="0" x2="1" y2="0">\n      <stop offset="0%" stop-color="#22d3ee"/>\n      <stop offset="100%" stop-color="#3b82f6"/>\n    </linearGradient>\n    ${gradientDefs}\n  </defs>\n\n  <rect width="100%" height="100%" fill="url(#bgSkills)" rx="16"/>\n\n  <!-- Header -->\n  <g transform="translate(${left}, ${topPad})">\n    <circle cx="8" cy="-2" r="4" fill="url(#accentSkills)"/>\n    <text x="20" y="0" fill="#e5e7eb" font-family="${font}" font-size="20" font-weight="700">Skills</text>\n    <rect x="0" y="18" width="100" height="3" fill="url(#accentSkills)" rx="2"/>\n  </g>\n\n  <!-- Pills -->\n  ${pillNodes}\n\n  <!-- Footer hint -->\n  <g transform="translate(${right}, ${height - 16})">\n    <text text-anchor="end" fill="#6b7280" font-family="${font}" font-size="11">Dynamic badges by skill list</text>\n  </g>\n</svg>`;
}
