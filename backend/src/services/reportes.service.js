const axios = require("axios");
const { JSREPORT_URL } = require("../config/env");

async function pingJsreport() {
  await axios.get(`${JSREPORT_URL}/api/ping`);
}

async function renderWithJsreport({ templateContent, data, format, reportName }) {
  const recipe = (format === "pdf") ? "chrome-pdf" : "html";
  const engine = "handlebars";

  const body = {
    template: { content: templateContent, recipe, engine },
    data,
    options: { reportName }
  };

  const resp = await axios.post(`${JSREPORT_URL}/api/report`, body, {
    responseType: "arraybuffer",
    headers: { "Content-Type": "application/json" }
  });

  return resp.data;
}

module.exports = { pingJsreport, renderWithJsreport };
