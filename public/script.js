async function getTicket() {
    let id = document.getElementById("ticketId").value.trim();

    if (!id) {
        alert("Enter a ticket ID");
        return;
    }

    let res = await fetch(`/ticket?id=${id}`);
    let data = await res.json();

    let box = document.getElementById("result");

    if (data.error) {
        box.innerHTML = "<p>No ticket found.</p>";
        return;
    }

    box.innerHTML = `
        <strong>ID:</strong> ${data["Incident ID*+"]}<br>
        <strong>Priority:</strong> ${data["Priority*"]}<br>
        <strong>Status:</strong> ${data["Status*"]}<br>
        <strong>Assigned Group:</strong> ${data["Assigned Group*+"]}<br>
        <strong>Assignee:</strong> ${data["Assignee+"]}<br>
        <strong>Submit Date:</strong> ${data["Submit Date"]}<br>
        <strong>Closed Date:</strong> ${data["Closed Date"]}<br>
        <strong>Impact:</strong> ${data["Impact*"]}<br>
        <strong>Incident Type:</strong> ${data["Incident Type*"]}<br>
        <strong>SLM Status:</strong> ${data["SLM Real Time Status"]}<br>
        <strong>Reported Date:</strong> ${data["Reported Date+"]}<br>
        <strong>Summary:</strong><br> ${data["Summary*"]}<br><br>
        <strong>Notes:</strong><br> ${data["Notes"]}<br><br>

        <strong>Resolution:</strong>
        <pre>${data["Resolution"]}</pre>
    `;
}
AQ