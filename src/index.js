const path = require("path");
const fs = require("fs/promises");
const Handlebars = require("handlebars");
const { getSalaryData } = require("./lib/xlsToJson");
const { createPayslip, getHtml } = require("./lib/generatePayslip");
const { sendEmailWithAttachment } = require("./lib/email");

async function run() {
  const salaryData = getSalaryData();
  Promise.all(
    salaryData
      .filter((data) => data["Generate Slip"])
      .map(async (data) => {
        const html = getHtml(data);
        const filename = `${data["Employee Code"]}-${data["Payslip For"]}`;
        await createPayslip(html, filename);
        const filePath = path.join(__dirname, "payslips", `${filename}.pdf`);
        const emailTemplatePath = path.join(
          __dirname,
          "static",
          "emailTemplate.html"
        );
        const source = await fs.readFile(emailTemplatePath, "utf8");
        const template = Handlebars.compile(source);
        const body = template(data);
        await sendEmailWithAttachment(
          data["Employee Email"],
          `Payslip ${data["Payslip For"]}`,
          body,
          filePath,
          `${filename}.pdf`
        );
        console.log(
          `---------- Email Triggered for ${data["Payslip For"]}------------`
        );
      })
  );
}

run();
