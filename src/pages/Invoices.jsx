import React, { useState, useEffect } from "react";
import { getAllData, getDataById } from "../Helper/firebaseHelper";
import { toast } from "react-toastify";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await getAllData("invoices");
      setInvoices(data || []);
    } catch (error) {
      console.error("Error loading invoices:", error);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const loadInvoiceDetails = async (invoice) => {
    try {
      setLoading(true);
      let details = null;

      switch (invoice.invoiceType) {
        case "FeedPurchase":
          details = await getDataById("feedPurchases", invoice.referenceId);
          break;
        case "ChickenPurchase":
          details = await getDataById("chickenPurchases", invoice.referenceId);
          break;
        case "ChickenSale":
          details = await getDataById("orders", invoice.referenceId);
          break;
        case "Salary":
          details = await getDataById("salaryPayments", invoice.referenceId);
          break;
        default:
          details = { message: "No additional details available" };
      }

      setSelectedInvoice({ ...invoice, details });
      setShowDetails(true);
    } catch (error) {
      console.error("Error loading invoice details:", error);
      toast.error("Failed to load invoice details");
    } finally {
      setLoading(false);
    }
  };

  const printInvoice = (invoice) => {
    const printWindow = window.open('', '_blank');
    const content = generateInvoiceHTML(invoice);
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  const generateInvoiceHTML = (invoice) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .invoice-info { margin-bottom: 20px; }
            .invoice-info h1 { margin: 0; color: #333; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .total { border-top: 2px solid #333; padding-top: 20px; margin-top: 20px; }
            .total h2 { margin: 0; color: #2196F3; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>POULTRY FARM INVOICE</h1>
            <p>Invoice #${invoice.invoiceId}</p>
          </div>
          <div class="invoice-info">
            <div class="details">
              <div>
                <strong>Invoice Type:</strong> ${invoice.invoiceType}<br>
                <strong>Date:</strong> ${invoice.date?.toDate ? invoice.date.toDate().toLocaleDateString() : "N/A"}<br>
                <strong>Created By:</strong> ${invoice.createdBy}
              </div>
            </div>
          </div>
          <div class="total">
            <h2>Total Amount: $${invoice.totalAmount?.toFixed(2)}</h2>
          </div>
          <p style="margin-top: 40px;">Thank you for your business!</p>
        </body>
      </html>
    `;
  };

  const exportToPDF = (invoice) => {
    // For production, you would use a PDF library like jsPDF or pdfmake
    toast.info("PDF export feature coming soon!");
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.referenceId?.includes(searchTerm) ||
                         invoice.invoiceType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || invoice.invoiceType === typeFilter;
    return matchesSearch && matchesType;
  });

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const totalRevenue = invoices.reduce((sum, inv) => sum + (parseFloat(inv.totalAmount) || 0), 0);

  const invoiceTypes = [...new Set(invoices.map(inv => inv.invoiceType))];

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Invoice Management</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ backgroundColor: "#4CAF50", padding: "10px 20px", borderRadius: 5 }}>
            <p style={{ margin: 0, fontSize: 12, color: "white" }}>Total Invoices</p>
            <h2 style={{ margin: 0, color: "white" }}>{invoices.length}</h2>
          </div>
          <div style={{ backgroundColor: "#2196F3", padding: "10px 20px", borderRadius: 5 }}>
            <p style={{ margin: 0, fontSize: 12, color: "white" }}>Total Revenue</p>
            <h2 style={{ margin: 0, color: "white" }}>${totalRevenue.toFixed(2)}</h2>
          </div>
        </div>
      </div>

      {showDetails && selectedInvoice && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: 30,
            width: "90%",
            maxWidth: "800px",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3>Invoice Details</h3>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedInvoice(null);
                }}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: 24,
                  cursor: "pointer"
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4>Invoice Information</h4>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: 10, fontWeight: "bold", border: "1px solid #ddd" }}>Invoice ID</td>
                    <td style={{ padding: 10, border: "1px solid #ddd" }}>{selectedInvoice.invoiceId}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 10, fontWeight: "bold", border: "1px solid #ddd" }}>Type</td>
                    <td style={{ padding: 10, border: "1px solid #ddd" }}>{selectedInvoice.invoiceType}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 10, fontWeight: "bold", border: "1px solid #ddd" }}>Date</td>
                    <td style={{ padding: 10, border: "1px solid #ddd" }}>
                      {selectedInvoice.date?.toDate ? selectedInvoice.date.toDate().toLocaleString() : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: 10, fontWeight: "bold", border: "1px solid #ddd" }}>Total Amount</td>
                    <td style={{ padding: 10, border: "1px solid #ddd", fontSize: 20, fontWeight: "bold", color: "#2196F3" }}>
                      ${selectedInvoice.totalAmount?.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {selectedInvoice.details && Object.keys(selectedInvoice.details).length > 1 && (
              <div style={{ marginBottom: 20 }}>
                <h4>Related Details</h4>
                <div style={{ backgroundColor: "#f5f5f5", padding: 15, borderRadius: 5 }}>
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                    {JSON.stringify(selectedInvoice.details, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => printInvoice(selectedInvoice)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: 5,
                  cursor: "pointer"
                }}
              >
                Print
              </button>
              <button
                onClick={() => exportToPDF(selectedInvoice)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: 5,
                  cursor: "pointer"
                }}
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 15, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by invoice ID, type, or reference..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ddd"
          }}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ddd"
          }}
        >
          <option value="All">All Types</option>
          {invoiceTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
              <thead>
                <tr style={{ backgroundColor: "#2196F3", color: "white" }}>
                  <th style={{ padding: 12, textAlign: "left" }}>Invoice ID</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Type</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Date</th>
                  <th style={{ padding: 12, textAlign: "right" }}>Total Amount</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Created By</th>
                  <th style={{ padding: 12, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInvoices.map((invoice) => (
                  <tr key={invoice.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: 12 }}>{invoice.invoiceId}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: 4,
                        backgroundColor: invoice.invoiceType === "ChickenSale" ? "#4CAF50" : 
                                        invoice.invoiceType === "Salary" ? "#FF9800" : "#2196F3",
                        color: "white",
                        fontSize: 12
                      }}>
                        {invoice.invoiceType}
                      </span>
                    </td>
                    <td style={{ padding: 12 }}>
                      {invoice.date?.toDate ? 
                        invoice.date.toDate().toLocaleDateString() : "N/A"}
                    </td>
                    <td style={{ padding: 12, textAlign: "right", fontWeight: "bold" }}>
                      ${invoice.totalAmount?.toFixed(2)}
                    </td>
                    <td style={{ padding: 12 }}>{invoice.createdBy}</td>
                    <td style={{ padding: 12, textAlign: "center" }}>
                      <button
                        onClick={() => loadInvoiceDetails(invoice)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#2196F3",
                          color: "white",
                          border: "none",
                          borderRadius: 3,
                          cursor: "pointer",
                          marginRight: 5
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => printInvoice(invoice)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#4CAF50",
                          color: "white",
                          border: "none",
                          borderRadius: 3,
                          cursor: "pointer"
                        }}
                      >
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInvoices.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
              No invoices found
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20, gap: 10 }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 15px",
                  backgroundColor: currentPage === 1 ? "#ccc" : "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: 5,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer"
                }}
              >
                Previous
              </button>
              <span style={{ padding: 8 }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: "8px 15px",
                  backgroundColor: currentPage === totalPages ? "#ccc" : "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: 5,
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Invoices;

