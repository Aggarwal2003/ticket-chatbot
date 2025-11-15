const express = require("express");
const XLSX = require("xlsx");
const cors = require("cors");
const path = require("path");

const app = express();

// Allow frontend + API
app.use(cors());

// Serve frontend from public folder
app.use(express.static(path.join(__dirname, "public")));

// Force Render to load index.html on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ------------------------
//  LOAD EXCEL TICKETS
// ------------------------
function loadTickets() {
  const filePath = path.join(
    __dirname,
    "Incident test report 1.rptdesign.xlsb"
  );

  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets["Report"]; // YOUR REAL SHEET NAME

  if (!sheet) {
    console.log("❌ Sheet 'Report' not found!");
    return [];
  }

  // Load as 2D array
  const full = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Find row containing "Incident ID*+"
  const headerRowIndex = full.findIndex(
    (row) => row && row.includes("Incident ID*+")
  );

  if (headerRowIndex === -1) {
    console.log("❌ Could not find header row.");
    return [];
  }

  const headers = full[headerRowIndex];
  const rows = full.slice(headerRowIndex + 1);

  // Convert rows into objects
  const tickets = rows.map((row) => {
    let obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i];
    });
    return obj;
  });

  return tickets;
}

// ------------------------
//  TICKET API ENDPOINT
// ------------------------
app.get("/ticket", (req, res) => {
  const ticketId = (req.query.id || "").trim().toLowerCase();

  const tickets = loadTickets();

  const ticket = tickets.find(
    (t) =>
      String(t["Incident ID*+"] || "")
        .trim()
        .toLowerCase() === ticketId
  );

  if (!ticket) {
    return res.json({ error: "No ticket found" });
  }

  res.json(ticket);
});

// ------------------------
//  START SERVER
// ------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
