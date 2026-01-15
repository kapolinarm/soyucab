function reportLayoutHtml(title, subtitle, columns) {
  return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; }
    h1 { font-size: 18px; margin: 0 0 6px 0; }
    h2 { font-size: 12px; font-weight: normal; margin: 0 0 14px 0; color: #555; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 6px; vertical-align: top; }
    th { background: #f3f3f3; text-align: left; }
    .meta { margin: 10px 0 12px 0; color: #666; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <h2>${subtitle}</h2>
  <div class="meta">Generado: {{generatedAt}}</div>

  <table>
    <thead>
      <tr>
        ${columns.map(c => `<th>${c}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      {{#each rows}}
        <tr>
          ${columns.map(c => `<td>{{${c}}}</td>`).join("")}
        </tr>
      {{/each}}
    </tbody>
  </table>
</body>
</html>
`;
}

module.exports = { reportLayoutHtml };
