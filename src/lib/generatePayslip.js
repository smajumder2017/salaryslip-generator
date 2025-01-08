const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const puppeteer = require("puppeteer");

// Read the HTML template
const templatePath = path.join(
  __dirname,
  "..",
  "static",
  "payslipTemplate.html"
);
const source = fsSync.readFileSync(templatePath, "utf8");
const logoPath = path.join(__dirname, "..", "static", "logo.png");
const logo = fsSync.readFileSync(logoPath).toString("base64");

function getHtml(data) {
  data.logo = logo;
  const template = Handlebars.compile(source);
  const html = template(data);
  return html;
}

async function createPayslip(html, fileName) {
  // Launch Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the content of the page
  await page.setContent(html);

  // Wait for content to load
  await page.waitForSelector("table");
  await page.waitForSelector("img");

  // Generate PDF
  const pdfBuffer = await page.pdf({
    format: "A4",
    // margin: { top: "1in", right: "1in", bottom: "1in", left: "1in" },
  });
  const filePath = path.join(__dirname, "..", "payslips", fileName);
  // Write PDF to file
  await fs.writeFile(`${filePath}.pdf`, pdfBuffer);

  // Close the browser
  await browser.close();
}

module.exports = {
  getHtml,
  createPayslip,
};
