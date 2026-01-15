const axios = require("axios");
const env = require("../config/env");

async function renderPdfFromHtml(html) {
  const url = `${env.JSREPORT_URL}/api/report`;
  const r = await axios.post(
    url,
    {
      template: {
        content: html,
        engine: "none",
        recipe: "chrome-pdf"
      },
      data: {}
    },
    { responseType: "arraybuffer" }
  );
  return Buffer.from(r.data);
}

module.exports = { renderPdfFromHtml };
