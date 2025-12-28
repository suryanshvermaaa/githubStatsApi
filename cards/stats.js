export function statsCard(stats) {
  const width = 600;
  const height = 240;

  const font = "Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif";

  const commits = stats.commits ?? 0;
  const prs = stats.prs ?? 0;
  const issues = stats.issues ?? 0;
  const maxVal = Math.max(commits, prs, issues, 1);
  const r = 34;
  const circ = 2 * Math.PI * r;
  const dashCommits = `${(commits / maxVal) * circ} ${circ}`;
  const dashPRs = `${(prs / maxVal) * circ} ${circ}`;
  const dashIssues = `${(issues / maxVal) * circ} ${circ}`;

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GitHub overview">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#0b1324"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.35" />
    </filter>
    <linearGradient id="tile" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#0b1020"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg)" rx="16"/>

  <!-- Header -->
  <g transform="translate(24, 26)">
    <circle cx="8" cy="-2" r="4" fill="url(#accent)"/>
    <text x="20" y="0" fill="#e5e7eb" font-family="${font}" font-size="20" font-weight="700">GitHub Overview</text>
    <rect x="0" y="18" width="120" height="3" fill="url(#accent)" rx="2"/>
  </g>

  <!-- KPI Tiles with circular rings -->
  <g transform="translate(24, 70)">
    <!-- Commits -->
    <g filter="url(#shadow)">
      <rect x="0" y="0" width="172" height="150" fill="url(#tile)" rx="14" stroke="#1f2937" stroke-width="1" />
      <!-- perfectly centered ring -->
      <g transform="translate(86, 78)">
        <circle r="${r}" fill="none" stroke="#1f2937" stroke-width="10" opacity="0.9" />
        <circle r="${r}" fill="none" stroke="url(#accent)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${dashCommits}" transform="rotate(-90)" />
      </g>
      <!-- label top, value below ring (outside circle) -->
      <text x="86" y="30" text-anchor="middle" fill="#9ca3af" font-family="${font}" font-size="12" font-weight="600">Commits</text>
      <text x="86" y="142" text-anchor="middle" fill="#f9fafb" font-family="${font}" font-size="26" font-weight="800">${commits}</text>
    </g>

    <!-- PRs -->
    <g transform="translate(190, 0)" filter="url(#shadow)">
      <rect x="0" y="0" width="172" height="150" fill="url(#tile)" rx="14" stroke="#1f2937" stroke-width="1" />
      <g transform="translate(86, 78)">
        <circle r="${r}" fill="none" stroke="#1f2937" stroke-width="10" opacity="0.9" />
        <circle r="${r}" fill="none" stroke="#3b82f6" stroke-width="10" stroke-linecap="round" stroke-dasharray="${dashPRs}" transform="rotate(-90)" />
      </g>
      <text x="86" y="30" text-anchor="middle" fill="#9ca3af" font-family="${font}" font-size="12" font-weight="600">Pull Requests</text>
      <text x="86" y="142" text-anchor="middle" fill="#f9fafb" font-family="${font}" font-size="26" font-weight="800">${prs}</text>
    </g>

    <!-- Issues -->
    <g transform="translate(380, 0)" filter="url(#shadow)">
      <rect x="0" y="0" width="172" height="150" fill="url(#tile)" rx="14" stroke="#1f2937" stroke-width="1" />
      <g transform="translate(86, 78)">
        <circle r="${r}" fill="none" stroke="#1f2937" stroke-width="10" opacity="0.9" />
        <circle r="${r}" fill="none" stroke="#f59e0b" stroke-width="10" stroke-linecap="round" stroke-dasharray="${dashIssues}" transform="rotate(-90)" />
      </g>
      <text x="86" y="30" text-anchor="middle" fill="#9ca3af" font-family="${font}" font-size="12" font-weight="600">Issues</text>
      <text x="86" y="142" text-anchor="middle" fill="#f9fafb" font-family="${font}" font-size="26" font-weight="800">${issues}</text>
    </g>
  </g>
</svg>`;
}
