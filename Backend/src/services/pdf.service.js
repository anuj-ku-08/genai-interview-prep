import puppeteer from "puppeteer";

export const generateResumePdfBuffer = async (resumeData) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          color: #222;
          line-height: 1.5;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 4px;
          text-transform: uppercase;
        }
        .header {
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          border-bottom: 1px solid #aaa;
          margin-top: 20px;
          margin-bottom: 8px;
          color: #111;
        }
        ul {
          padding-left: 20px;
          margin: 6px 0;
        }
        li {
          margin-bottom: 4px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${resumeData.fullName || "Candidate"}</h1>
        <p>Target Role: <strong>${resumeData.jobRole}</strong> | Email: ${resumeData.email || "N/A"}</p>
      </div>

      <div class="section-title">Target Skills Profile</div>
      <ul>
        ${resumeData.matchedSkills?.map((s) => `<li><strong>${s}</strong> (Matched)</li>`).join("")}
        ${resumeData.missingSkills?.map((s) => `<li><strong>${s}</strong> (Target Skill)</li>`).join("")}
      </ul>

      <div class="section-title">Key Technical Competencies & Questions</div>
      <ul>
        ${resumeData.technicalQuestions?.map((q) => `<li><strong>${q.question}</strong><br/><em>Focus:</em> ${q.intention}</li>`).join("")}
      </ul>

      <div class="section-title">Actionable Preparation Strategy</div>
      <ul>
        ${resumeData.recommendations?.map((r) => `<li>${r}</li>`).join("")}
      </ul>
    </body>
    </html>
  `;

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
  });

  await browser.close();
  return pdfBuffer;
};