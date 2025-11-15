const express = require("express");
const XLSX = require("xlsx");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.static("public"));  // serve frontend

function loadTickets() {
    const wb = XLSX.readFile("Incident test report 1.rptdesign.xlsb");
    const sheet = wb.Sheets["Report"]; // <-- REAL SHEET NAME

    // Read entire sheet into rows
    const full = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // FIND HEADER ROW
    let headerRowIndex = full.findIndex(row =>
        row.includes("Incident ID*+")
    );

    if (headerRowIndex === -1) {
        console.log("❌ Could not find header row");
        return [];
    }

    const headers = full[headerRowIndex];
    const dataRows = full.slice(headerRowIndex + 1);

    // Convert to clean JSON
    const tickets = dataRows.map(row => {
        let obj = {};
        headers.forEach((h, i) => {
            obj[h] = row[i];
        });
        return obj;
    });

    return tickets;
}





app.get("/ticket", (req, res) => {
    const ticketId = String(req.query.id || "").trim().toLowerCase();

    const tickets = loadTickets();

    const ticket = tickets.find(t => {
        return String(t["Incident ID*+"] || "")
            .trim()
            .toLowerCase() === ticketId;
    });

    if (!ticket) {
        return res.json({ error: "No ticket found" });
    }

    res.json(ticket);
});

const PORT = process.env.PORT || 3000;

app.listen(3000,"0.0.0.0", () => {
    console.log("Server running → http://localhost:3000");
});
