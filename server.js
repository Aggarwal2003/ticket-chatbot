const express = require("express");
const XLSX = require("xlsx");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static("public"));  // IMPORTANT

function loadTickets() {
    const wb = XLSX.readFile(path.join(__dirname, "Incident test report 1.rptdesign.xlsb"));
    const sheet = wb.Sheets["Report"];

    const full = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let headerRowIndex = full.findIndex(row => row && row.includes("Incident ID*+"));
    if (headerRowIndex === -1) return [];

    const headers = full[headerRowIndex];
    const dataRows = full.slice(headerRowIndex + 1);

    return dataRows.map(row => {
        let obj = {};
        headers.forEach((h, i) => { obj[h] = row[i]; });
        return obj;
    });
}

app.get("/ticket", (req, res) => {
    const ticketId = (req.query.id || "").trim().toLowerCase();
    const tickets = loadTickets();

    const ticket = tickets.find(
        t => String(t["Incident ID*+"] || "").trim().toLowerCase() === ticketId
    );

    if (!ticket) return res.json({ error: "No ticket found" });

    res.json(ticket);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
