const xlsx = require("xlsx");
const path = require("path");

function getSalaryData() {
  const filePath = path.join(__dirname, "..", "data", "Salary.xlsx");
  // Read the Excel file
  const workbook = xlsx.readFile(filePath);

  // Get the first sheet (you can specify sheet name or index)
  const sheetName = "Master"; // Replace with your sheet name
  const masterSheet = workbook.Sheets[sheetName];

  // Convert sheet to JSON
  const masterData = xlsx.utils.sheet_to_json(masterSheet);

  const salaryDataList = masterData.flatMap((row) => {
    const sheetName = row["Sheet Name"];

    if (!row["Generate Slip"]) {
      return;
    }

    const salaryInfoSheet = workbook.Sheets[sheetName];
    const salaryData = xlsx.utils.sheet_to_json(salaryInfoSheet);

    return salaryData;
  });

  return salaryDataList;
}

module.exports = { getSalaryData };
