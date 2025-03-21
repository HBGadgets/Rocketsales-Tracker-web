import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  TextField,
  IconButton,
  Snackbar,
} from "@mui/material";
import { FaPrint, FaFilePdf, FaShare, FaEdit, FaSave } from "react-icons/fa";
import jsPDF from "jspdf";

// Default structure (used if no data is provided)

const defaultInvoiceData = {
  companyDetails: {
    name: "Your Company Name",
    address: "1234 Main St, City, Country",
    gstin: "23AAAAA0000A1Z5",
    phone: "+91 9876543210",
    email: "info@yourcompany.com",
  },
  invoiceDetails: {
    number: "INV-2024-001",
    date: "2025-02-02",
    hsnCode: "HSN1234",
    paymentType: "Online Transfer",
    paymentStatus: "Paid",
    branch: "Main Branch",
    supervisor: "Jane Doe",
    branchCode: "BR001",
    region: "North Region",
  },
  customerDetails: {
    name: "Customer Name",
    address: "5678 Other St, City, Country",
    gstin: "29BBBBB1111B1Z5",
    phone: "+91 9876543211",
    email: "customer@example.com",
  },
  products: [
    { id: 1, name: "Product A", quantity: 2, unitPrice: 5000, totalPrice: 10000 },
    { id: 2, name: "Product B", quantity: 1, unitPrice: 9000, totalPrice: 9000 },
  ],
};

// Helper to map flat data to the nested structure (if necessary)
const normalizeInvoiceData = (data) => {
  if (!data) return defaultInvoiceData;
  if (data.companyDetails) return data;

  return {
    companyDetails: {
      name: data.companyName || "Your Company Name",
      address: data.companyAddress || "",
      gstin: data.HSNcode || "",
      phone: data.phone || "",
      email: data.email || "",
    },
    invoiceDetails: {
      number: data._id || "INV-0000",
      date: data.date || new Date().toISOString().split("T")[0],
      hsnCode: data.HSNcode || "",
      paymentType: "", // adjust if available
      paymentStatus: "", // adjust if available
      branch: data.branchName || "",
      supervisor: data.supervisorName || "",
      branchCode: "", // adjust if available
      region: "", // adjust if available
    },
    customerDetails: {
      name: data.customerName || "",
      address: data.customerAddress || "",
      gstin: "", // adjust if available
      phone: "", // adjust if available
      email: "", // adjust if available
    },
    products: (data.products || []).map((product) => ({
      id: product._id,
      name: product.productName,
      hsnCode: product.hsnCode,
      quantity: product.quantity,
      unitPrice: product.price,
      totalPrice: product.quantity * product.price,
    })),
  };
};

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#fff",
  margin: "20px auto",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  // For print, remove extra styling
//   "@media print": {
//     width: "210mm",
//     minHeight: "297mm",
//     padding: "20mm",
//     margin: 0,
//     boxShadow: "none",
//   },
"@media print": {
    width: "250mm",
    minHeight: "297mm",
    padding: "20mm",
    margin: 0,
    boxShadow: "none",
    backgroundColor: "transparent", // Remove background color
    // "& *": {
    //   backgroundColor: "transparent", // Remove background color for all child elements
    //   color: "#000", // Ensure text is black for better print readability
    // },
    // "& .MuiPaper-root": {
    //   boxShadow: "none", // Remove shadow from Paper components
    //   border: "1px solid #000", // Add border for better visibility
    // },
    // "& .MuiTable-root": {
    //   borderCollapse: "collapse", // Ensure table borders are visible
    //   "& th, & td": {
    //     border: "1px solid #000", // Add borders to table cells
    //   },
    // },
   
  },
}));

const StyledHeader = styled(Box)({
  marginBottom: "2rem",
  "& img": {
    maxWidth: "150px",
    height: "auto",
  },
});

const StyledTable = styled(TableContainer)({
  marginTop: "2rem",
  marginBottom: "2rem",
});

const EditableTypography = styled(Box)({
  position: "relative",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
});

const InvoiceView = ({ invoiceData = defaultInvoiceData, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [localInvoiceData, setLocalInvoiceData] = useState(normalizeInvoiceData(invoiceData));
  const invoiceRef = useRef(null);
  const subtotal = localInvoiceData.products.reduce((acc, product) => 
    acc + (product.quantity * product.unitPrice), 0);
  const gst = localInvoiceData.invoiceDetails?.gst || 0;
  const discount = invoiceData?.discount || 0;
  const total = subtotal + gst - discount;
  const cgst = gst / 2;
  const sgst = gst / 2;

  useEffect(() => {
    setLocalInvoiceData(normalizeInvoiceData(invoiceData));
  }, [invoiceData]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    setIsEditing(false);
    setSnackbarOpen(true);
    if (onSave) onSave(localInvoiceData);
  };

  const handleFieldChange = (section, field, value) => {
    setLocalInvoiceData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate a PDF that looks like the print view but without background
//   const generatePDF = () => {
//     return new Promise((resolve) => {
//       const invoiceElement = invoiceRef.current;
//       // Store current inline styles that may affect PDF rendering
//       const originalBackground = invoiceElement.style.background;
//       const originalBoxShadow = invoiceElement.style.boxShadow;

//       // Temporarily remove background and shadow for a cleaner PDF
//       invoiceElement.style.background = "none";
//       invoiceElement.style.boxShadow = "none";

//       const pdf = new jsPDF("p", "mm", "a4");
//       pdf.html(invoiceElement, {
//         callback: function (doc) {
//           // Restore the original styles
//           invoiceElement.style.background = originalBackground;
//           invoiceElement.style.boxShadow = originalBoxShadow;
//           resolve(doc);
//         },
//         // Ensure html2canvas does not paint any background
//         html2canvas: { backgroundColor: null },
//         x: 10,
//         y: 10,
//         width: 190,
//       });
//     });
//   };
const generatePDF = () => {
    return new Promise((resolve) => {
      const invoiceElement = invoiceRef.current;
  
      // Temporarily apply print styles
      const originalStyles = {
        visibility: invoiceElement.style.visibility,
        position: invoiceElement.style.position,
        width: invoiceElement.style.width,
        margin: invoiceElement.style.margin,
        padding: invoiceElement.style.padding,
      };
  
      // Apply print styles
      invoiceElement.style.visibility = "visible";
      invoiceElement.style.position = "absolute";
      invoiceElement.style.width = "210mm";
      invoiceElement.style.margin = "0";
      invoiceElement.style.padding = "0";
  
      const pdf = new jsPDF("p", "mm", "a4");
      const options = {
        callback: (pdf) => {
          // Restore the original styles
          Object.assign(invoiceElement.style, originalStyles);
          resolve(pdf);
        },
        html2canvas: {
          scale: 0.2, // Adjust scale for better quality
          letterRendering: true,
          useCORS: true,
          logging: true, // Enable logging for debugging
          allowTaint: true,
          backgroundColor: null, // Ensure no background is rendered
          windowWidth: 700, // Match the window width for consistent rendering
        },
        x: 10,
        y: 10,
        width: 190, // Width of the content in mm
      };
  
      pdf.html(invoiceElement, options);
    });
  };
  const handleDownloadPDF = async () => {
    const pdf = await generatePDF();
    pdf.save(`${localInvoiceData.invoiceDetails?.number || "invoice"}.pdf`);
  };

  const handleShare = async () => {
    const pdf = await generatePDF();
    const pdfBlob = pdf.output("blob");
    const file = new File(
      [pdfBlob],
      `${localInvoiceData.invoiceDetails?.number || "invoice"}.pdf`,
      {
        type: "application/pdf",
      }
    );
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: "Invoice",
          text: "Please find attached the invoice.",
          files: [file],
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to downloading the PDF if sharing is not supported
      handleDownloadPDF();
    }
  };

  // Renders field as TextField (when editing) or Typography (view-only)
  const renderEditableField = (value, section, field) => {
    return isEditing ? (
      <TextField
        fullWidth
        size="small"
        value={value || ""}
        onChange={(e) => handleFieldChange(section, field, e.target.value)}
        sx={{ mb: 1 }}
      />
    ) : (
      <Typography>{value || ""}</Typography>
    );
  };

  return (
    
    <StyledContainer ref={invoiceRef}>
         <Box textAlign="center" mb={2}>
        <Typography variant="h6" style={{ fontWeight: "bold" }}>
          INVOICE DETAILS
        </Typography>
        {/* <Typography variant="h4" style={{ fontWeight: "bold", marginTop: 4 }}>
          PURCHASE ORDER
        </Typography> */}
      </Box>
      <StyledHeader>
        <Grid container justifyContent="space-between" alignItems="flex-start">
          <Grid item xs={6}>
            {/* <img
              src="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff"
              alt="Company Logo"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff";
                e.target.alt = "Fallback Logo";
              }}
            /> */}
            <EditableTypography>
            <Typography variant="h6">Supplier Details</Typography>
              {renderEditableField(
                localInvoiceData.companyDetails?.name,
                "companyDetails",
                "name"
              )}
              {renderEditableField(
                localInvoiceData.companyDetails?.address,
                "companyDetails",
                "address"
              )}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
  GSTIN: {renderEditableField(localInvoiceData.companyDetails?.gstin, "companyDetails", "gstin")}
</span>
              
              {/* {renderEditableField(
                localInvoiceData.companyDetails?.gstin,
                "companyDetails",
                "gstin"
              )} */}
              {renderEditableField(
                localInvoiceData.companyDetails?.phone,
                "companyDetails",
                "phone"
              )}
              {renderEditableField(
                localInvoiceData.companyDetails?.email,
                "companyDetails",
                "email"
              )}
            </EditableTypography>
            <hr style={{ border: "0.5px solid black", width: "100%" }} />
            <Typography variant="h6"> Invoice To</Typography>
            <EditableTypography>
            {renderEditableField(
              localInvoiceData.customerDetails?.name,
              "customerDetails",
              "name"
            )}
            {renderEditableField(
              localInvoiceData.customerDetails?.address,
              "customerDetails",
              "address"
            )}
                {/* {renderEditableField(
                    localInvoiceData.invoiceDetails?.number,
                    "invoiceDetails",
                    "number"
                )} */}
              {renderEditableField(
                localInvoiceData.invoiceDetails?.date,
                "invoiceDetails",
                "date"
              )}
              {renderEditableField(
                localInvoiceData.invoiceDetails?.hsnCode,
                "invoiceDetails",
                "hsnCode"
              )}
              {renderEditableField(
                localInvoiceData.invoiceDetails?.paymentType,
                "invoiceDetails",
                "paymentType"
              )}
              {renderEditableField(
                localInvoiceData.invoiceDetails?.paymentStatus,
                "invoiceDetails",
                "paymentStatus"
              )}
            </EditableTypography>
            <hr style={{ border: "0.5px solid black", width: "100%" }} />

          </Grid>
          <Grid item xs={5} sx={{ textAlign: "right" }}>
            <EditableTypography sx={{ textAlign: "left" }}>
            <Typography variant="h6">Invoice Details</Typography>
            {/* <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
  Invoice Id: {renderEditableField( localInvoiceData.invoiceDetails?.number, "invoiceDetails", "number")}
</span>

<span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
Date:
              {renderEditableField(
                localInvoiceData.invoiceDetails?.date,
                "invoiceDetails",
                "date"
              )}
              
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
HSN Code:
              {renderEditableField(
                localInvoiceData.invoiceDetails?.hsnCode,
                "invoiceDetails",
                "hsnCode"
              )}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
Payement Type:
              {renderEditableField(
                localInvoiceData.invoiceDetails?.paymentType,
                "invoiceDetails",
                "paymentType"
              )}
                </span> */}
            
  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
    <strong>Invoice Id:</strong> {renderEditableField(localInvoiceData.invoiceDetails?.number, "invoiceDetails", "number")}
  </div>

  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}tyle={{ display: "block", marginBottom: "5px" }}>
    <strong>Date:</strong> {renderEditableField(localInvoiceData.invoiceDetails?.date, "invoiceDetails", "date")}
  </div>

  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}tyle={{ display: "block", marginBottom: "5px" }}>
    <strong>HSN Code:</strong> {renderEditableField(localInvoiceData.invoiceDetails?.hsnCode, "invoiceDetails", "hsnCode")}
  </div>

  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}tyle={{ display: "block", marginBottom: "5px" }}>
    <strong>Payment Type:</strong> {renderEditableField(localInvoiceData.invoiceDetails?.paymentType, "invoiceDetails", "paymentType")}
  </div>


              {/* {renderEditableField(
                localInvoiceData.invoiceDetails?.paymentStatus,
                "invoiceDetails",
                "paymentStatus"
              )} */}
            </EditableTypography>
            <hr style={{ border: "0.5px solid black", width: "100%" }} />
          {/* <EditableTypography>
            {renderEditableField(
              localInvoiceData.invoiceDetails?.branch,
              "invoiceDetails",
              "branch"
            )}
            {renderEditableField(
              localInvoiceData.invoiceDetails?.supervisor,
              "invoiceDetails",
              "supervisor"
            )}
            {renderEditableField(
              localInvoiceData.invoiceDetails?.branchCode,
              "invoiceDetails",
              "branchCode"
            )}
            {renderEditableField(
              localInvoiceData.invoiceDetails?.region,
              "invoiceDetails",
              "region"
            )}
          </EditableTypography> */}
          <EditableTypography sx={{ textAlign: "left" }}>
          <Typography variant="h6">Branch Details:</Typography>
  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}><strong>Branch:</strong> {renderEditableField(localInvoiceData.invoiceDetails?.branch, "invoiceDetails", "branch")}</div>
  <div style={{ display: "flex", alignItems: "center", gap: "5px" }} ><strong>Supervisor:</strong> {renderEditableField(localInvoiceData.invoiceDetails?.supervisor, "invoiceDetails", "supervisor")}</div>
  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}><strong>Branch Code:</strong> {renderEditableField(localInvoiceData.invoiceDetails?.branchCode, "invoiceDetails", "branchCode")}</div>
  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}><strong>Region:</strong> {renderEditableField(localInvoiceData.invoiceDetails?.region, "invoiceDetails", "region")}</div>
</EditableTypography>

          </Grid>
        </Grid>
      </StyledHeader>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6}>
          {/* <Typography variant="h6">Bill To:</Typography>
          <EditableTypography>
            {renderEditableField(
              localInvoiceData.customerDetails?.name,
              "customerDetails",
              "name"
            )}
            {renderEditableField(
              localInvoiceData.customerDetails?.address,
              "customerDetails",
              "address"
            )}
            {renderEditableField(
              localInvoiceData.customerDetails?.gstin,
              "customerDetails",
              "gstin"
            )}
            {renderEditableField(
              localInvoiceData.customerDetails?.phone,
              "customerDetails",
              "phone"
            )}
            {renderEditableField(
              localInvoiceData.customerDetails?.email,
              "customerDetails",
              "email"
            )}
          </EditableTypography> */}
        </Grid>
       
      </Grid>

      <StyledTable component={Paper}>
        <Table aria-label="invoice items table">
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell align="right">HSN Code</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Unit Price (₹)</TableCell>
              <TableCell align="right">Total Price (₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(localInvoiceData.products || []).map((product, index) => (
              <TableRow
                key={product.id || index}
                sx={{
                  backgroundColor: index % 2 === 0 ? "rgb(241, 248, 253)" : "inherit",
                }}
              >
                <TableCell>{product.name || ""}</TableCell>
                <TableCell align="right">{product.hsnCode || ''}</TableCell>
                <TableCell align="right">{product.quantity || 0}</TableCell>
                <TableCell align="right">{product.unitPrice || 0}</TableCell>
                <TableCell align="right">{product.totalPrice || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTable>

      <Grid container justifyContent="flex-end">
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            {/* Static amounts for illustration; calculate dynamically as needed */}
            <Typography>Subtotal: ₹{subtotal.toLocaleString()}</Typography>
        <Typography>CGST: ₹{cgst.toLocaleString()}</Typography>
        <Typography>SGST: ₹{sgst.toLocaleString()}</Typography>
        <Typography>Discount: -₹{discount.toLocaleString()}</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Total Amount: ₹{total.toLocaleString()}
        </Typography>
            {/* <Typography>Subtotal: ₹19,000</Typography>
            <Typography>CGST (9%): ₹250</Typography>
            <Typography>SGST (9%): ₹250</Typography>
            <Typography>Discount: -₹1,000</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total Amount: ₹20,500
            </Typography> */}
            <Typography variant="body2" sx={{ mt: 1 }}>
              Payment Terms: Net 30 days
            </Typography>
            <Typography variant="body2">Bank Details: HDFC Bank</Typography>
            <Typography variant="body2">
              A/C No: XXXX XXXX XXXX 1234
            </Typography>
            <Typography variant="body2">IFSC: HDFC0001234</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 4,
          display: "flex",
          gap: 2,
          "@media print": { display: "none" },
          
        }}
      >
        {isEditing ? (
          <Button
            variant="contained"
            color="success"
            startIcon={<FaSave />}
            onClick={handleSave}
            sx={{ "@media print": { display: "none" } }}
          >
            Save Changes
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaEdit />}
            onClick={handleEdit}
            sx={{ "@media print": { display: "none" } }}
          >
            Edit Invoice
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<FaPrint />}
          onClick={handlePrint}
          aria-label="Print Invoice"
        >
          Download Invoice
        </Button>
        {/* <Button
          variant="outlined"
          startIcon={<FaFilePdf />}
          onClick={handleDownloadPDF}
          aria-label="Download PDF"
        >
          Download PDF
        </Button> */}
        <IconButton
          color="primary"
          onClick={handleShare}
          aria-label="Share Invoice"
        >
          <FaShare />
        </IconButton>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Invoice details saved successfully!"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </StyledContainer>
  );
};

export default InvoiceView;
