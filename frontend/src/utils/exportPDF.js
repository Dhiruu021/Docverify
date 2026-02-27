import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportPDF = (title, data) => {
  try {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(title, 14, 15);

    const tableBody = data.map((item, index) => [
      index + 1,
      item.docType || "-",
      item.status || "-",
      item.createdAt
        ? new Date(item.createdAt).toLocaleString()
        : "-",
    ]);

    autoTable(doc, {
      head: [["#", "Document", "Status", "Date"]],
      body: tableBody,
      startY: 25,
    });

    // DOWNLOAD
    doc.save(`${title}.pdf`);
  } catch (err) {
    console.error("PDF GENERATION ERROR", err);
    alert("PDF generation failed");
  }
};

export default exportPDF;
